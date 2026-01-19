package org.zerp.Gateway.exception;

public class CustomForbiddenException extends RuntimeException{
    public CustomForbiddenException(String message){
        super(message);
    }
}
