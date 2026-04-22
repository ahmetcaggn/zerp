package org.zerp.socket_service.interceptor;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.zerp.socket_service.config.SocketServiceProperties;
import org.zerp.socket_service.exception.WsRateLimitException;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Log4j2
@RequiredArgsConstructor
public class InboundRateLimitInterceptor implements ChannelInterceptor {

    private final SocketServiceProperties socketServiceProperties;
    private final Map<String, SessionRateLimit> sessionRateLimits = new ConcurrentHashMap<>();

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }
        if (!StompCommand.SEND.equals(accessor.getCommand())) {
            return message;
        }
        if (!isRateLimitedDestination(accessor.getDestination())) {
            return message;
        }
        String sessionId = accessor.getSessionId();
        if (sessionId == null) {
            return message;
        }

        SessionRateLimit sessionRateLimit =
                sessionRateLimits.computeIfAbsent(sessionId, key -> new SessionRateLimit(System.currentTimeMillis()));

        long currentTime = System.currentTimeMillis();
        if (currentTime - sessionRateLimit.windowStartedAt > socketServiceProperties.getRateLimitWindowMillis()) {
            sessionRateLimit.reset(currentTime);
        }

        int requestCount = sessionRateLimit.requestCount.incrementAndGet();
        if (requestCount > socketServiceProperties.getRateLimit().getMaxMessages()) {
            log.warn("Rate limit exceeded for sessionId={} requestCount={}", sessionId, requestCount);
            throw new WsRateLimitException("Rate limit exceeded. Please slow down.");
        }

        return message;
    }

    public void cleanupSession(String sessionId) {
        sessionRateLimits.remove(sessionId);
    }

    private boolean isRateLimitedDestination(String destination) {
        return destination != null && !"/app/system/heartbeat".equals(destination);
    }

    private static final class SessionRateLimit {
        private volatile long windowStartedAt;
        private final AtomicInteger requestCount = new AtomicInteger();

        private SessionRateLimit(long windowStartedAt) {
            this.windowStartedAt = windowStartedAt;
        }

        private void reset(long windowStartedAt) {
            this.windowStartedAt = windowStartedAt;
            this.requestCount.set(0);
        }
    }
}
