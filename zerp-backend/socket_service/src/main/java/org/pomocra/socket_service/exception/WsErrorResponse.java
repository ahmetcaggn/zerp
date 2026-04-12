package org.pomocra.socket_service.exception;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class WsErrorResponse {
    private String type;
    private String message;
    private long timestamp;
}
