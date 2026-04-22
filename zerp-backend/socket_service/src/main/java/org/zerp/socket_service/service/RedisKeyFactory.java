package org.zerp.socket_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.zerp.socket_service.config.SocketServiceProperties;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.StringJoiner;

@Component
@RequiredArgsConstructor
public class RedisKeyFactory {

    private final SocketServiceProperties socketServiceProperties;

    public String session(String sessionId) {
        return key("session", encode(sessionId));
    }

    public String userSessions(String userId) {
        return key("user", encode(userId), "sessions");
    }

    public String nodes() {
        return key("nodes");
    }

    public String nodeHeartbeat(String nodeId) {
        return key("node", encode(nodeId), "heartbeat");
    }

    public String nodeSessions(String nodeId) {
        return key("node", encode(nodeId), "sessions");
    }

    public String destinationSessions(String destination) {
        return key("destination", encode(destination), "sessions");
    }

    public String nodeDestinationSessions(String nodeId, String destination) {
        return key("node", encode(nodeId), "destination", encode(destination), "sessions");
    }

    public String subscriptionIndex(String sessionId) {
        return key("session", encode(sessionId), "subscriptions");
    }

    private String key(String... segments) {
        StringJoiner joiner = new StringJoiner(":");
        joiner.add("ws");
        joiner.add(socketServiceProperties.getNamespace());
        for (String segment : segments) {
            joiner.add(segment);
        }
        return joiner.toString();
    }

    private String encode(String value) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }
}
