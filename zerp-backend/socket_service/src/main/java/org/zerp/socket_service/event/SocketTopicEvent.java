package org.zerp.socket_service.event;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Data
public class SocketTopicEvent {
    private String eventId;
    private String destination;
    private JsonNode payload;
    private Map<String, Object> headers = new LinkedHashMap<>();
    private String tenantId;
    private String sourceService;
    private Instant occurredAt;
}
