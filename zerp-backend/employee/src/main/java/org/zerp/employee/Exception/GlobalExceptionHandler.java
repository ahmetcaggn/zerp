package org.zerp.employee.Exception;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.zerp.common.context.RequestContext;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.ErrorDetails;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Log4j2
public class GlobalExceptionHandler {

    @Value("${app.version:0.0.1-SNAPSHOT}")
    private String appVersion;

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleEntityNotFoundException(EntityNotFoundException exception) {
        log.error(exception.getMessage(), exception);
        
        ApiResponse<Void> response = ApiResponse.<Void>error(
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage(),
                ErrorDetails.of("NOT_FOUND", exception.getMessage())
        ).withDurationMs(RequestContext.endTiming()).withVersion(appVersion);
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResourceException(DuplicateResourceException exception) {
        log.error(exception.getMessage(), exception);
        
        ApiResponse<Void> response = ApiResponse.<Void>error(
                HttpStatus.CONFLICT.value(),
                exception.getMessage(),
                ErrorDetails.of("DUPLICATE_RESOURCE", exception.getMessage())
        ).withDurationMs(RequestContext.endTiming()).withVersion(appVersion);
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationExceptions(MethodArgumentNotValidException exception) {
        log.error("Validation error", exception);
        
        Map<String, String> fieldErrors = new HashMap<>();
        exception.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        
        ApiResponse<Void> response = ApiResponse.<Void>error(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                ErrorDetails.withFieldErrors(fieldErrors)
        ).withDurationMs(RequestContext.endTiming()).withVersion(appVersion);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException exception) {
        log.error(exception.getMessage(), exception);
        
        ApiResponse<Void> response = ApiResponse.<Void>error(
                HttpStatus.BAD_REQUEST.value(),
                exception.getMessage(),
                ErrorDetails.of("BAD_REQUEST", exception.getMessage())
        ).withDurationMs(RequestContext.endTiming()).withVersion(appVersion);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception exception) {
        log.error("Unexpected error occurred", exception);
        
        ApiResponse<Void> response = ApiResponse.<Void>error(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred",
                ErrorDetails.of("INTERNAL_ERROR", exception.getMessage())
        ).withDurationMs(RequestContext.endTiming()).withVersion(appVersion);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
