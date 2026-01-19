package org.zerp.notification.Exception;

public class MailSaveFailedException extends RuntimeException {
    public MailSaveFailedException(String message) {
        super(message);
    }
}
