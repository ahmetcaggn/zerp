package org.zerp.socket_service.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
@Log4j2
public class GlobalExceptionHandler {

    @MessageExceptionHandler(WsRateLimitException.class)
    @SendToUser("/queue/errors")
    public WsErrorResponse handleRateLimitException(WsRateLimitException exception) {
        return WsErrorResponse.builder()
                .type(WsErrorType.RATE_LIMIT.name())
                .message(exception.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    @MessageExceptionHandler(WsSecurityException.class)
    @SendToUser("/queue/errors")
    public WsErrorResponse handleSecurityException(WsSecurityException exception) {
        return WsErrorResponse.builder()
                .type(WsErrorType.SECURITY.name())
                .message(exception.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    @MessageExceptionHandler(WsValidationException.class)
    @SendToUser("/queue/errors")
    public WsErrorResponse handleValidationException(WsValidationException exception) {
        return WsErrorResponse.builder()
                .type(WsErrorType.VALIDATION.name())
                .message(exception.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
    }

    @MessageExceptionHandler(Exception.class)
    @SendToUser("/queue/errors")
    public WsErrorResponse handleGenericException(Exception exception) {
        log.error("Unexpected websocket error", exception);
        return WsErrorResponse.builder()
                .type(WsErrorType.INTERNAL.name())
                .message("Unexpected websocket error")
                .timestamp(System.currentTimeMillis())
                .build();
    }
}
