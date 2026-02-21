package org.zerp.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Timing information for API requests.
 * Tracks when a service method started, ended, and how long it took.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TimingInfo {

    /**
     * Timestamp when the service method was entered
     */
    private LocalDateTime startTime;

    /**
     * Timestamp when the service method completed
     */
    private LocalDateTime endTime;

    /**
     * Duration of the service method execution in milliseconds
     */
    private Long durationMs;

    /**
     * Name of the service method that was executed
     */
    private String methodName;

    /**
     * Create timing info from start and end times
     */
    public static TimingInfo of(LocalDateTime startTime, LocalDateTime endTime, String methodName) {
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();
        return TimingInfo.builder()
                .startTime(startTime)
                .endTime(endTime)
                .durationMs(durationMs)
                .methodName(methodName)
                .build();
    }

    /**
     * Create timing info from start time (calculates end time as now)
     */
    public static TimingInfo since(LocalDateTime startTime, String methodName) {
        LocalDateTime endTime = LocalDateTime.now();
        return of(startTime, endTime, methodName);
    }
}
