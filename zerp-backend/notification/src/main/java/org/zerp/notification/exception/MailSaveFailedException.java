package org.zerp.notification.exception;

public class MailSaveFailedException extends RuntimeException {
    public MailSaveFailedException(String message) {
        super(message);
    }
}
