package org.zerp.socket_service.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;
import org.zerp.socket_service.event.SocketSessionRegistration;
import org.zerp.socket_service.interceptor.InboundRateLimitInterceptor;
import org.zerp.socket_service.service.RedisSocketRegistry;

import java.security.Principal;

@Component
@Log4j2
@RequiredArgsConstructor
public class StompSessionEventListener {

    private final RedisSocketRegistry redisSocketRegistry;
    private final InboundRateLimitInterceptor inboundRateLimitInterceptor;

    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        Principal principal = event.getUser();
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (principal == null || !StringUtils.hasText(accessor.getSessionId())) {
            return;
        }

        long now = System.currentTimeMillis();
        redisSocketRegistry.registerSession(new SocketSessionRegistration(
                accessor.getSessionId(),
                principal.getName(),
                accessor.getSessionAttributes() == null ? null : (String) accessor.getSessionAttributes().get("tenantId"),
                redisSocketRegistry.getCurrentNodeId(),
                accessor.getSessionAttributes() == null ? "unknown" : (String) accessor.getSessionAttributes().getOrDefault("remoteAddress", "unknown"),
                accessor.getSessionAttributes() == null ? "unknown" : (String) accessor.getSessionAttributes().getOrDefault("userAgent", "unknown"),
                now,
                now
        ));
        log.info("Registered websocket session sessionId={} principalId={}", accessor.getSessionId(), principal.getName());
    }

    @EventListener
    public void handleSessionSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();
        if (!StringUtils.hasText(accessor.getSessionId())
                || !StringUtils.hasText(accessor.getSubscriptionId())
                || !StringUtils.hasText(destination)
                || !destination.startsWith(redisSocketRegistry.getTopicPrefix())) {
            return;
        }

        redisSocketRegistry.registerSubscription(accessor.getSessionId(), accessor.getSubscriptionId(), destination);
        log.debug("Registered subscription sessionId={} subscriptionId={} destination={}",
                accessor.getSessionId(), accessor.getSubscriptionId(), destination);
    }

    @EventListener
    public void handleSessionUnsubscribe(SessionUnsubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (!StringUtils.hasText(accessor.getSessionId()) || !StringUtils.hasText(accessor.getSubscriptionId())) {
            return;
        }

        redisSocketRegistry.unregisterSubscription(accessor.getSessionId(), accessor.getSubscriptionId());
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (!StringUtils.hasText(accessor.getSessionId())) {
            return;
        }

        redisSocketRegistry.removeSession(accessor.getSessionId());
        inboundRateLimitInterceptor.cleanupSession(accessor.getSessionId());
        log.info("Disconnected websocket session sessionId={}", accessor.getSessionId());
    }
}
