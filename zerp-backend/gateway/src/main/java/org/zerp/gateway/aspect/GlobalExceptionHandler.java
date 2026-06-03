package org.zerp.gateway.aspect;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.util.exception.ProblemDetailFactory;
import org.zerp.gateway.exception.CustomForbiddenException;
import org.zerp.gateway.exception.InvalidJwtTokenException;
import org.zerp.gateway.exception.NoSuchServiceException;

@ControllerAdvice
@Log4j2
@RequiredArgsConstructor
@Import(ProblemDetailFactory.class)
public class GlobalExceptionHandler {
    private final ProblemDetailFactory problemDetailFactory;

    @ExceptionHandler(InvalidJwtTokenException.class)
    public ResponseEntity<Object> handleInvalidJwtTokenException(InvalidJwtTokenException exception){
        log.error(exception.getMessage(), exception);
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(exception.getMessage());
    }

    @ExceptionHandler(CustomForbiddenException.class)
    public ResponseEntity<Object> handleCustomForbiddenException(CustomForbiddenException exception){
        log.error(exception.getMessage(), exception);
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(exception.getMessage());
    }

    @ExceptionHandler(NoSuchServiceException.class)
    public ResponseEntity<Object> handleNoSuchServiceException(NoSuchServiceException exception){
        log.error(exception.getMessage(), exception);
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(exception.getMessage());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ProblemDetail> handleResponseStatusException(ResponseStatusException exception) {
        log.info("Handled ResponseStatusException with status {}: {}",
                exception.getStatusCode(), exception.getReason());
        return ResponseEntity.status(exception.getStatusCode()).body(problemDetailFactory.buildProblem(
                HttpStatus.valueOf(exception.getStatusCode().value()),
                "UNKNOWN", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgumentException(IllegalArgumentException exception) {
        log.error(exception.getMessage(), exception);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetailFactory.buildProblem(
                HttpStatus.BAD_REQUEST,
                "BAD_REQUEST",
                exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGenericException(Exception exception) {
        log.error("Unexpected error occurred", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                problemDetailFactory.buildProblem(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "An unexpected error occurred"));
    }
}
