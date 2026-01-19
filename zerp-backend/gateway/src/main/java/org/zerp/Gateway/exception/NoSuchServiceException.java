package org.zerp.Gateway.exception;

public class NoSuchServiceException extends RuntimeException{
    public NoSuchServiceException(String message) {
        super(message);
    }
}
