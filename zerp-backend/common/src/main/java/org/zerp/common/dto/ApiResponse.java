package org.zerp.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper for all REST endpoints.
 * Contains data, status information, duration, and version.
 *
 * @param <T> The type of the response data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    /**
     * Indicates if the request was successful
     */
    private boolean success;

    /**
     * HTTP status code
     */
    private int statusCode;

    /**
     * Human-readable message
     */
    private String message;

    /**
     * The actual response data
     */
    private T data;

    /**
     * Duration of the request in milliseconds
     */
    private Long durationMs;

    /**
     * Application version
     */
    private String version;

    /**
     * Error details (only present on error responses)
     */
    private ErrorDetails error;

    /**
     * Timestamp when the response was generated
     */
    private LocalDateTime timestamp;

    // =============================================
    // Static Factory Methods
    // =============================================

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .statusCode(200)
                .message("Success")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .statusCode(200)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> created(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .statusCode(201)
                .message("Created successfully")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> noContent() {
        return ApiResponse.<T>builder()
                .success(true)
                .statusCode(204)
                .message("No content")
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(int statusCode, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .statusCode(statusCode)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(int statusCode, String message, ErrorDetails errorDetails) {
        return ApiResponse.<T>builder()
                .success(false)
                .statusCode(statusCode)
                .message(message)
                .error(errorDetails)
                .timestamp(LocalDateTime.now())
                .build();
    }

    // =============================================
    // Fluent Methods
    // =============================================

    public ApiResponse<T> withDurationMs(Long durationMs) {
        this.durationMs = durationMs;
        return this;
    }

    public ApiResponse<T> withVersion(String version) {
        this.version = version;
        return this;
    }
}
