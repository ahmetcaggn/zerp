package org.zerp.socket_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.socket", name = "maintenance-enabled", havingValue = "true", matchIfMissing = true)
public class SocketMaintenanceService {

    private final RedisSocketRegistry redisSocketRegistry;

    @Scheduled(fixedDelayString = "#{@socketServiceProperties.nodeHeartbeatIntervalMillis}")
    public void refreshCurrentNodeHeartbeat() {
        redisSocketRegistry.refreshNodeHeartbeat(redisSocketRegistry.getCurrentNodeId());
    }

    @Scheduled(fixedDelayString = "#{@socketServiceProperties.cleanupIntervalMillis}")
    public void cleanupExpiredSessions() {
        redisSocketRegistry.cleanupExpiredSessions();
    }
}
