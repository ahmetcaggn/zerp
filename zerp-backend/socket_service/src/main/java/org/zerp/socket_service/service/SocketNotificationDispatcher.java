package org.zerp.socket_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.util.StringUtils;
import org.zerp.socket_service.config.SocketServiceProperties;
import org.zerp.socket_service.event.SocketTopicEvent;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class SocketNotificationDispatcher {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RedisSocketRegistry redisSocketRegistry;
    private final SocketServiceProperties socketServiceProperties;

    public void dispatch(SocketTopicEvent socketTopicEvent) {
        validate(socketTopicEvent);

        if (!redisSocketRegistry.hasLocalSubscribers(socketTopicEvent.getDestination())) {
            log.debug("Skipping dispatch for destination={} because current node has no subscribers",
                    socketTopicEvent.getDestination());
            return;
        }

        simpMessagingTemplate.convertAndSend(
                socketTopicEvent.getDestination(),
                socketTopicEvent.getPayload() == null ? Map.of() : socketTopicEvent.getPayload(),
                buildHeaders(socketTopicEvent)
        );

        log.info("Dispatched websocket event eventId={} destination={} nodeId={}",
                resolveEventId(socketTopicEvent),
                socketTopicEvent.getDestination(),
                socketServiceProperties.getInstanceId());
    }

    private void validate(SocketTopicEvent socketTopicEvent) {
        if (socketTopicEvent == null) {
            throw new IllegalArgumentException("Socket event payload cannot be null");
        }
        if (!StringUtils.hasText(socketTopicEvent.getDestination())) {
            throw new IllegalArgumentException("Socket event destination is required");
        }
        if (!socketTopicEvent.getDestination().startsWith(socketServiceProperties.getTopicPrefix())) {
            throw new IllegalArgumentException(
                    "Socket event destination must start with " + socketServiceProperties.getTopicPrefix());
        }
    }

    private Map<String, Object> buildHeaders(SocketTopicEvent socketTopicEvent) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setLeaveMutable(true);
        headerAccessor.setContentType(MimeTypeUtils.APPLICATION_JSON);
        headerAccessor.setHeader("socketEventId", resolveEventId(socketTopicEvent));
        headerAccessor.setHeader("socketSourceService", defaultIfBlank(socketTopicEvent.getSourceService(), "unknown"));
        headerAccessor.setHeader("socketOccurredAt", resolveOccurredAt(socketTopicEvent));
        if (StringUtils.hasText(socketTopicEvent.getTenantId())) {
            headerAccessor.setHeader("socketTenantId", socketTopicEvent.getTenantId());
        }
        socketTopicEvent.getHeaders().forEach(headerAccessor::setHeader);
        return headerAccessor.getMessageHeaders();
    }

    private String resolveEventId(SocketTopicEvent socketTopicEvent) {
        return StringUtils.hasText(socketTopicEvent.getEventId())
                ? socketTopicEvent.getEventId()
                : UUID.randomUUID().toString();
    }

    private String resolveOccurredAt(SocketTopicEvent socketTopicEvent) {
        Instant occurredAt = socketTopicEvent.getOccurredAt();
        return occurredAt == null ? Instant.now().toString() : occurredAt.toString();
    }

    private String defaultIfBlank(String value, String fallback) {
        return StringUtils.hasText(value) ? value : fallback;
    }
}
