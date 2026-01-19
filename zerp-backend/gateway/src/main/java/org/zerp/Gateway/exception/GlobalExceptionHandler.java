package org.zerp.Gateway.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Log4j2
public class GlobalExceptionHandler {
//    @ExceptionHandler(HttpClientErrorException.class)
//    public ResponseEntity<Object> handleHttpClientErrorException(HttpClientErrorException exception) {
//        if (exception.getStatusCode().equals(HttpStatus.FORBIDDEN)) {
//            log.error(exception.getMessage(), exception);
//            return ResponseEntity
//                    .status(HttpStatus.FORBIDDEN)
//                    .body(exception.getMessage());
//        }
//        if (exception.getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
//            log.error(exception.getMessage(), exception);
//            return ResponseEntity
//                    .status(HttpStatus.UNAUTHORIZED)
//                    .body(exception.getMessage());
//        }
//        log.error(exception.getMessage(), exception);
//        return ResponseEntity
//                .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body("Unknown Server Error");
//    }

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
}
