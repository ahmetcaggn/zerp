package org.zerp.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Error details for API error responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorDetails {

    /**
     * Error type/code for programmatic handling
     */
    private String errorCode;

    /**
     * Detailed error description
     */
    private String details;

    /**
     * Stack trace (only in development mode)
     */
    private String stackTrace;

    /**
     * Field-level validation errors
     */
    private Map<String, String> fieldErrors;

    public static ErrorDetails of(String errorCode, String details) {
        return ErrorDetails.builder()
                .errorCode(errorCode)
                .details(details)
                .build();
    }

    public static ErrorDetails withFieldErrors(Map<String, String> fieldErrors) {
        return ErrorDetails.builder()
                .errorCode("VALIDATION_ERROR")
                .fieldErrors(fieldErrors)
                .build();
    }
}
