package org.zerp.gateway.exception;

public class CustomForbiddenException extends RuntimeException{
    public CustomForbiddenException(String message){
        super(message);
    }
}
