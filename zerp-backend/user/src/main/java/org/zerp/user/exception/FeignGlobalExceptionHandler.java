package org.zerp.user.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.ErrorDetails;

@Log4j2
@Order(1)
@RestControllerAdvice(basePackages = "org.zerp.user.controller.feign")
public class FeignGlobalExceptionHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleResponseStatusException(ResponseStatusException exception) {
        log.warn("Handling ResponseStatusException with status {} and reason '{}'",
                exception.getStatusCode(), exception.getReason(), exception);
        String message = exception.getReason() != null ? exception.getReason() : "Request failed";
        return buildErrorResponse(exception.getStatusCode(), "REQUEST_FAILED", message, exception);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException exception
    ) {
        log.warn("Handling HttpMessageNotReadableException: {}", exception.getMessage(), exception);
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "INVALID_REQUEST_BODY",
                "Request body is missing or invalid",
                exception
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleGenericException(Exception exception) {
        log.error("Handling unexpected exception: {}", exception.getMessage(), exception);
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "Unexpected error while processing user request",
                exception
        );
    }

    private ResponseEntity<ApiResponse<ErrorDetails>> buildErrorResponse(
            HttpStatusCode status,
            String errorCode,
            String message,
            Exception exception
    ) {
        log.error("{} - {}", errorCode, message, exception);
        ApiResponse<ErrorDetails> errorBody = ApiResponse.<ErrorDetails>builder()
                .success(false)
                .statusCode(status.value())
                .message(message)
                .data(ErrorDetails.of(errorCode, message))
                .build();
        return ResponseEntity.status(status).body(errorBody);
    }
}
