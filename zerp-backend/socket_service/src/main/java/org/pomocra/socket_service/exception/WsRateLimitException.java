package org.pomocra.socket_service.exception;

public class WsRateLimitException extends RuntimeException {
    public WsRateLimitException(String message) {
        super(message);
    }
}
