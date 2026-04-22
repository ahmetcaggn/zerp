package org.zerp.socket_service.event;

public record SocketSessionRegistration(
        String sessionId,
        String principalId,
        String tenantId,
        String nodeId,
        String remoteAddress,
        String userAgent,
        long connectedAt,
        long lastSeenAt
) {
}
