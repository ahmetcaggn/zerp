package org.zerp.common.context;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Thread-local context for storing timing information across the request lifecycle.
 */
public class RequestContext {
    private static final ThreadLocal<RequestContextData> context = ThreadLocal.withInitial(RequestContextData::new);

    public static void startTiming(String methodName) {
        RequestContextData data = context.get();
        data.setStartTime(LocalDateTime.now());
        data.setMethodName(methodName);
    }

    /**
     * End timing and return duration in milliseconds
     */
    public static Long endTiming() {
        RequestContextData data = context.get();
        if (data.getStartTime() == null) {
            return null;
        }
        LocalDateTime endTime = LocalDateTime.now();
        return java.time.Duration.between(data.getStartTime(), endTime).toMillis();
    }

    @Setter
    @Getter
    public static class RequestContextData {
        private LocalDateTime startTime;
        private String methodName;
    }
}
