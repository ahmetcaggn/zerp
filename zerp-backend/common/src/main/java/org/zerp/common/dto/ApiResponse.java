package org.zerp.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.MDC;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private int statusCode;
    private String message;
    private T data;
    private Meta meta;
    private List<Parameter> parameters;
    private static final String CORRELATION_ID_MDC_KEY = "correlationId";

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .statusCode(200)
                .message("Success")
                .data(data)
                .meta(defaultMeta())
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .statusCode(200)
                .message(message)
                .data(data)
                .meta(defaultMeta())
                .build();
    }

    public static <T> ApiResponse<T> created(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .statusCode(201)
                .message("Created successfully")
                .data(data)
                .meta(defaultMeta())
                .build();
    }

    public static <T> ApiResponse<T> noContent() {
        return ApiResponse.<T>builder()
                .success(true)
                .statusCode(204)
                .message("No content")
                .meta(defaultMeta())
                .build();
    }

    public ApiResponse<T> withDurationMs(Long durationMs) {
        ensureMeta();
        this.meta.setDurationMs(durationMs);
        return this;
    }

    public ApiResponse<T> withVersion(String version) {
        ensureMeta();
        this.meta.setVersion(version);
        return this;
    }

    public ApiResponse<T> withTraceId(String traceId) {
        ensureMeta();
        this.meta.setTraceId(traceId);
        return this;
    }

    public ApiResponse<T> withPath(String path) {
        ensureMeta();
        this.meta.setPath(path);
        return this;
    }

    public ApiResponse<T> withParameters(List<Parameter> parameters) {
        this.parameters = parameters;
        return this;
    }

    private void ensureMeta() {
        if (this.meta == null) {
            this.meta = new Meta();
        }
    }

    private static Meta defaultMeta() {
        String correlationId = MDC.get(CORRELATION_ID_MDC_KEY);
        return Meta.builder()
                .timestamp(Instant.now())
                .traceId(hasText(correlationId) ? correlationId : null)
                .build();
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
