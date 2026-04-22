package org.zerp.socket_service.exception;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class WsErrorResponse {
    String type;
    String message;
    long timestamp;
}
