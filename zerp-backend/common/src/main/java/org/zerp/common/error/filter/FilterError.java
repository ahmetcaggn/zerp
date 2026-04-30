package org.zerp.common.error.filter;

import lombok.*;

import java.util.List;

/**
 * Base class for filter-related errors, encapsulating a message and an optional underlying exception. This class is
 * sealed to restrict subclassing to specific error types, ensuring a clear hierarchy of filter errors.
 */
sealed abstract public class FilterError extends Exception permits FilterError.Multiple, FilterError.Single {
    @Getter
    @Setter
    @AllArgsConstructor
    sealed public static abstract class Single extends FilterError permits FilterKeyError, FilterValueError {
        private String message;
        private Exception exception;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static final class Multiple extends FilterError {
        List<FilterError.Single> errors;
    }

    /**
     * Internal error class for unexpected issues during filter processing. This class is intended for use within the
     * filter processing logic and should not be exposed to external consumers. It encapsulates a FilterError instance
     * to provide detailed context about the internal error that occurred.
     */
    @Getter
    @AllArgsConstructor
    public static final class Runtime extends IllegalArgumentException {
        private FilterError.Single error;

        @Override
        public String getMessage() {
            return "FilterError: " + error.getMessage();
        }
    }
}
