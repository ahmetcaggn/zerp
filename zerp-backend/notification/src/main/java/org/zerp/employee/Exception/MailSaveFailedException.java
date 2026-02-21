package org.zerp.employee.Exception;

public class MailSaveFailedException extends RuntimeException {
    public MailSaveFailedException(String message) {
        super(message);
    }
}
