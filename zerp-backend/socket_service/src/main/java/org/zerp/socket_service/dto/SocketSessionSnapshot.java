package org.zerp.socket_service.dto;

import java.util.List;

public record SocketSessionSnapshot(
        String sessionId,
        String principalId,
        String tenantId,
        String nodeId,
        String remoteAddress,
        String userAgent,
        long connectedAt,
        long lastSeenAt,
        List<String> subscriptions
) {
}
