package org.zerp.gateway.exception;

public class NoSuchServiceException extends RuntimeException{
    public NoSuchServiceException(String message) {
        super(message);
    }
}
