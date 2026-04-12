package org.pomocra.socket_service.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.util.Map;

/**
 * Global exception handler for WebSocket messaging.
 * Handles exceptions thrown during STOMP message processing.
 */
@ControllerAdvice
@Log4j2
public class GlobalExceptionHandler {

    /**
     * Handle rate limit exceeded exceptions.
     * Sends error message to the user's personal error queue.
     */
    @MessageExceptionHandler(WsRateLimitException.class)
    @SendToUser("/queue/errors")
    public WsErrorResponse handleRateLimitException(WsRateLimitException ex) {
        return WsErrorResponse.builder()
                .type(WsErrorType.RATE_LIMIT.name())
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * Handle authentication/authorization exceptions.
     */
    @MessageExceptionHandler(WsSecurityException.class)
    @SendToUser("/queue/errors")
    public WsErrorResponse handleSecurityException(WsSecurityException ex) {
        return WsErrorResponse.builder()
                .type(WsErrorType.SECURITY.name())
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * Handle validation exceptions (invalid message content).
     */
    @MessageExceptionHandler(WsValidationException.class)
    @SendToUser("/queue/errors")
    public WsErrorResponse handleValidationException(WsValidationException ex) {
        return WsErrorResponse.builder()
                .type(WsErrorType.VALIDATION.name())
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    /**
     * Handle all other uncaught exceptions.
     */
    @MessageExceptionHandler(Exception.class)
    @SendToUser("/queue/errors")
    public WsErrorResponse handleGeneric(Exception ex) {
        log.error("Unexpected WS error", ex);
        return WsErrorResponse.builder()
                .type(WsErrorType.INTERNAL.name())
                .message("Unexpected error")
                .timestamp(System.currentTimeMillis())
                .build();
    }
}
