package org.zerp.socket_service.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Data
@Component("socketServiceProperties")
@ConfigurationProperties(prefix = "app.socket")
public class SocketServiceProperties {

    private String namespace = "socket-service";
    private String instanceId = "socket-service:" + UUID.randomUUID();
    private String endpoint = "/ws";
    private List<String> allowedOriginPatterns = List.of("http://localhost:3000");
    private String identityHeader = "x-user-id";
    private String tenantHeader = "x-tenant-id";
    private String topicPrefix = "/topic";
    private long sessionTimeoutSeconds = 90;
    private long nodeHeartbeatIntervalSeconds = 10;
    private long nodeHeartbeatTtlSeconds = 30;
    private long cleanupIntervalSeconds = 30;
    private Kafka kafka = new Kafka();
    private RateLimit rateLimit = new RateLimit();

    public String getKafkaTopic() {
        return kafka.getTopic();
    }

    public String getKafkaConsumerGroupId() {
        return kafka.getConsumerGroupPrefix() + "-" + instanceId;
    }

    public long getSessionTimeoutMillis() {
        return sessionTimeoutSeconds * 1000;
    }

    public long getNodeHeartbeatIntervalMillis() {
        return nodeHeartbeatIntervalSeconds * 1000;
    }

    public long getNodeHeartbeatTtlSecondsResolved() {
        return Math.max(nodeHeartbeatTtlSeconds, nodeHeartbeatIntervalSeconds + 5);
    }

    public long getCleanupIntervalMillis() {
        return cleanupIntervalSeconds * 1000;
    }

    public long getRateLimitWindowMillis() {
        return rateLimit.getWindowSeconds() * 1000;
    }

    @Data
    public static class Kafka {
        private boolean enabled = true;
        private String topic = "websocket-notifications";
        private String consumerGroupPrefix = "socket-service";
        private String autoOffsetReset = "latest";
        private int concurrency = 1;
    }

    @Data
    public static class RateLimit {
        private int maxMessages = 120;
        private long windowSeconds = 60;
    }
}
