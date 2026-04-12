package org.pomocra.socket_service.exception;

public class WsValidationException extends RuntimeException {
    public WsValidationException(String message) {
        super(message);
    }
}
