package org.zerp.socket_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.zerp.socket_service.config.SocketServiceProperties;
import org.zerp.socket_service.dto.DestinationSubscriptionSummary;
import org.zerp.socket_service.dto.SocketSessionSnapshot;
import org.zerp.socket_service.event.SocketSessionRegistration;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

@Service
@Log4j2
@RequiredArgsConstructor
public class RedisSocketRegistry {

    private static final String FIELD_SESSION_ID = "sessionId";
    private static final String FIELD_PRINCIPAL_ID = "principalId";
    private static final String FIELD_TENANT_ID = "tenantId";
    private static final String FIELD_NODE_ID = "nodeId";
    private static final String FIELD_REMOTE_ADDRESS = "remoteAddress";
    private static final String FIELD_USER_AGENT = "userAgent";
    private static final String FIELD_CONNECTED_AT = "connectedAt";
    private static final String FIELD_LAST_SEEN_AT = "lastSeenAt";

    private final StringRedisTemplate stringRedisTemplate;
    private final RedisKeyFactory redisKeyFactory;
    private final SocketServiceProperties socketServiceProperties;

    public String getCurrentNodeId() {
        return socketServiceProperties.getInstanceId();
    }

    public String getTopicPrefix() {
        return socketServiceProperties.getTopicPrefix();
    }

    public void registerSession(SocketSessionRegistration registration) {
        runSafely("registerSession", registration.sessionId(), () -> {
            Map<String, String> sessionValues = new LinkedHashMap<>();
            sessionValues.put(FIELD_SESSION_ID, registration.sessionId());
            sessionValues.put(FIELD_PRINCIPAL_ID, registration.principalId());
            sessionValues.put(FIELD_TENANT_ID, defaultString(registration.tenantId()));
            sessionValues.put(FIELD_NODE_ID, registration.nodeId());
            sessionValues.put(FIELD_REMOTE_ADDRESS, defaultString(registration.remoteAddress()));
            sessionValues.put(FIELD_USER_AGENT, defaultString(registration.userAgent()));
            sessionValues.put(FIELD_CONNECTED_AT, Long.toString(registration.connectedAt()));
            sessionValues.put(FIELD_LAST_SEEN_AT, Long.toString(registration.lastSeenAt()));

            stringRedisTemplate.opsForHash().putAll(redisKeyFactory.session(registration.sessionId()), sessionValues);
            stringRedisTemplate.opsForSet().add(redisKeyFactory.userSessions(registration.principalId()), registration.sessionId());
            stringRedisTemplate.opsForSet().add(redisKeyFactory.nodeSessions(registration.nodeId()), registration.sessionId());
            refreshNodeHeartbeat(registration.nodeId());
        });
    }

    public void touchSession(String sessionId) {
        runSafely("touchSession", sessionId, () -> {
            if (!Boolean.TRUE.equals(stringRedisTemplate.hasKey(redisKeyFactory.session(sessionId)))) {
                log.debug("Ignoring heartbeat for unknown sessionId={}", sessionId);
                return;
            }
            stringRedisTemplate.opsForHash().put(
                    redisKeyFactory.session(sessionId),
                    FIELD_LAST_SEEN_AT,
                    Long.toString(System.currentTimeMillis())
            );
        });
    }

    public void registerSubscription(String sessionId, String subscriptionId, String destination) {
        runSafely("registerSubscription", sessionId, () -> {
            Map<Object, Object> sessionMetadata = stringRedisTemplate.opsForHash().entries(redisKeyFactory.session(sessionId));
            if (sessionMetadata.isEmpty()) {
                log.debug("Skipping subscription registration for missing sessionId={}", sessionId);
                return;
            }

            String nodeId = getString(sessionMetadata, FIELD_NODE_ID);
            stringRedisTemplate.opsForHash().put(redisKeyFactory.subscriptionIndex(sessionId), subscriptionId, destination);
            stringRedisTemplate.opsForSet().add(redisKeyFactory.destinationSessions(destination), sessionId);
            stringRedisTemplate.opsForSet().add(redisKeyFactory.nodeDestinationSessions(nodeId, destination), sessionId);
            touchSession(sessionId);
        });
    }

    public void unregisterSubscription(String sessionId, String subscriptionId) {
        runSafely("unregisterSubscription", sessionId, () -> {
            String subscriptionKey = redisKeyFactory.subscriptionIndex(sessionId);
            Object destinationObject = stringRedisTemplate.opsForHash().get(subscriptionKey, subscriptionId);
            if (!(destinationObject instanceof String destination)) {
                return;
            }

            stringRedisTemplate.opsForHash().delete(subscriptionKey, subscriptionId);

            Map<Object, Object> remainingSubscriptions = stringRedisTemplate.opsForHash().entries(subscriptionKey);
            if (remainingSubscriptions.containsValue(destination)) {
                return;
            }

            Map<Object, Object> sessionMetadata = stringRedisTemplate.opsForHash().entries(redisKeyFactory.session(sessionId));
            String nodeId = getString(sessionMetadata, FIELD_NODE_ID);
            stringRedisTemplate.opsForSet().remove(redisKeyFactory.destinationSessions(destination), sessionId);
            if (StringUtils.hasText(nodeId)) {
                stringRedisTemplate.opsForSet().remove(redisKeyFactory.nodeDestinationSessions(nodeId, destination), sessionId);
            }
        });
    }

    public void removeSession(String sessionId) {
        runSafely("removeSession", sessionId, () -> {
            Map<Object, Object> sessionMetadata = stringRedisTemplate.opsForHash().entries(redisKeyFactory.session(sessionId));
            if (sessionMetadata.isEmpty()) {
                clearIndexesForMissingSession(sessionId, null);
                return;
            }

            String principalId = getString(sessionMetadata, FIELD_PRINCIPAL_ID);
            String nodeId = getString(sessionMetadata, FIELD_NODE_ID);
            clearIndexesForMissingSession(sessionId, nodeId);
            stringRedisTemplate.delete(redisKeyFactory.session(sessionId));

            if (StringUtils.hasText(principalId)) {
                stringRedisTemplate.opsForSet().remove(redisKeyFactory.userSessions(principalId), sessionId);
            }
            if (StringUtils.hasText(nodeId)) {
                stringRedisTemplate.opsForSet().remove(redisKeyFactory.nodeSessions(nodeId), sessionId);
            }
        });
    }

    public void refreshNodeHeartbeat(String nodeId) {
        runSafely("refreshNodeHeartbeat", nodeId, () -> {
            stringRedisTemplate.opsForSet().add(redisKeyFactory.nodes(), nodeId);
            stringRedisTemplate.opsForValue().set(
                    redisKeyFactory.nodeHeartbeat(nodeId),
                    Long.toString(System.currentTimeMillis()),
                    socketServiceProperties.getNodeHeartbeatTtlSecondsResolved(),
                    TimeUnit.SECONDS
            );
        });
    }

    public void cleanupExpiredSessions() {
        runSafely("cleanupExpiredSessions", socketServiceProperties.getInstanceId(), () -> {
            Set<String> nodeIds = stringRedisTemplate.opsForSet().members(redisKeyFactory.nodes());
            if (nodeIds == null || nodeIds.isEmpty()) {
                return;
            }

            long now = System.currentTimeMillis();
            for (String nodeId : nodeIds) {
                cleanupNodeSessions(nodeId, now);
            }
        });
    }

    public boolean hasLocalSubscribers(String destination) {
        return runSafely("hasLocalSubscribers", destination, () -> {
            Long subscriberCount = stringRedisTemplate.opsForSet()
                    .size(redisKeyFactory.nodeDestinationSessions(getCurrentNodeId(), destination));
            return subscriberCount != null && subscriberCount > 0;
        }, false);
    }

    public DestinationSubscriptionSummary getDestinationSummary(String destination) {
        return runSafely("getDestinationSummary", destination, () -> {
            Long localCount = stringRedisTemplate.opsForSet()
                    .size(redisKeyFactory.nodeDestinationSessions(getCurrentNodeId(), destination));
            Long totalCount = stringRedisTemplate.opsForSet().size(redisKeyFactory.destinationSessions(destination));
            return new DestinationSubscriptionSummary(
                    destination,
                    getCurrentNodeId(),
                    localCount == null ? 0 : localCount,
                    totalCount == null ? 0 : totalCount
            );
        }, new DestinationSubscriptionSummary(destination, getCurrentNodeId(), 0, 0));
    }

    public Set<String> getUserSessions(String userId) {
        return runSafely("getUserSessions", userId, () -> {
            Set<String> sessionIds = stringRedisTemplate.opsForSet().members(redisKeyFactory.userSessions(userId));
            return sessionIds == null ? Set.of() : new TreeSet<>(sessionIds);
        }, Set.of());
    }

    public Optional<SocketSessionSnapshot> getSessionSnapshot(String sessionId) {
        return runSafely("getSessionSnapshot", sessionId, () -> {
            Map<Object, Object> sessionMetadata = stringRedisTemplate.opsForHash().entries(redisKeyFactory.session(sessionId));
            if (sessionMetadata.isEmpty()) {
                return Optional.empty();
            }

            Map<Object, Object> subscriptionEntries = stringRedisTemplate.opsForHash()
                    .entries(redisKeyFactory.subscriptionIndex(sessionId));
            Set<String> uniqueSubscriptions = new HashSet<>();
            for (Object value : subscriptionEntries.values()) {
                if (value instanceof String destination) {
                    uniqueSubscriptions.add(destination);
                }
            }

            return Optional.of(new SocketSessionSnapshot(
                    sessionId,
                    getString(sessionMetadata, FIELD_PRINCIPAL_ID),
                    getString(sessionMetadata, FIELD_TENANT_ID),
                    getString(sessionMetadata, FIELD_NODE_ID),
                    getString(sessionMetadata, FIELD_REMOTE_ADDRESS),
                    getString(sessionMetadata, FIELD_USER_AGENT),
                    parseLong(sessionMetadata.get(FIELD_CONNECTED_AT)),
                    parseLong(sessionMetadata.get(FIELD_LAST_SEEN_AT)),
                    new ArrayList<>(new TreeSet<>(uniqueSubscriptions))
            ));
        }, Optional.empty());
    }

    private void cleanupNodeSessions(String nodeId, long now) {
        boolean nodeAlive = Boolean.TRUE.equals(stringRedisTemplate.hasKey(redisKeyFactory.nodeHeartbeat(nodeId)));
        Set<String> sessionIds = stringRedisTemplate.opsForSet().members(redisKeyFactory.nodeSessions(nodeId));
        if (sessionIds == null || sessionIds.isEmpty()) {
            if (!nodeAlive) {
                stringRedisTemplate.opsForSet().remove(redisKeyFactory.nodes(), nodeId);
            }
            return;
        }

        for (String sessionId : sessionIds) {
            Map<Object, Object> sessionMetadata = stringRedisTemplate.opsForHash().entries(redisKeyFactory.session(sessionId));
            if (sessionMetadata.isEmpty()) {
                clearIndexesForMissingSession(sessionId, nodeId);
                stringRedisTemplate.opsForSet().remove(redisKeyFactory.nodeSessions(nodeId), sessionId);
                continue;
            }

            long lastSeenAt = parseLong(sessionMetadata.get(FIELD_LAST_SEEN_AT));
            boolean sessionExpired = now - lastSeenAt > socketServiceProperties.getSessionTimeoutMillis();
            if (!nodeAlive || sessionExpired) {
                removeSession(sessionId);
            }
        }

        if (!nodeAlive) {
            stringRedisTemplate.opsForSet().remove(redisKeyFactory.nodes(), nodeId);
            stringRedisTemplate.delete(redisKeyFactory.nodeHeartbeat(nodeId));
        }
    }

    private void clearIndexesForMissingSession(String sessionId, String nodeId) {
        String subscriptionKey = redisKeyFactory.subscriptionIndex(sessionId);
        Map<Object, Object> subscriptionEntries = stringRedisTemplate.opsForHash().entries(subscriptionKey);
        Set<String> destinations = new HashSet<>();
        for (Object value : subscriptionEntries.values()) {
            if (value instanceof String destination) {
                destinations.add(destination);
            }
        }

        for (String destination : destinations) {
            stringRedisTemplate.opsForSet().remove(redisKeyFactory.destinationSessions(destination), sessionId);
            if (StringUtils.hasText(nodeId)) {
                stringRedisTemplate.opsForSet().remove(redisKeyFactory.nodeDestinationSessions(nodeId, destination), sessionId);
            }
        }

        stringRedisTemplate.delete(subscriptionKey);
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }

    private String getString(Map<Object, Object> source, String key) {
        Object value = source.get(key);
        return value instanceof String stringValue ? stringValue : null;
    }

    private long parseLong(Object value) {
        if (value == null) {
            return 0;
        }
        return Long.parseLong(value.toString());
    }

    private void runSafely(String operation, String identifier, Runnable runnable) {
        try {
            runnable.run();
        } catch (Exception exception) {
            log.warn("Redis operation failed operation={} identifier={} message={}",
                    operation, identifier, exception.getMessage());
        }
    }

    private <T> T runSafely(String operation, String identifier, Supplier<T> supplier, T fallback) {
        try {
            return supplier.get();
        } catch (Exception exception) {
            log.warn("Redis operation failed operation={} identifier={} message={}",
                    operation, identifier, exception.getMessage());
            return fallback;
        }
    }
}
