package org.zerp.common.context;

import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.Instant;

/**
 * Thread-local context for storing timing information across the request lifecycle.
 */
public class RequestContext {
    private static final ThreadLocal<RequestContextData> context = ThreadLocal.withInitial(RequestContextData::new);

    public static void startTiming(String methodName) {
        startTimingIfAbsent(Instant.now(), methodName);
    }

    public static void startTimingIfAbsent(String methodName) {
        startTimingIfAbsent(Instant.now(), methodName);
    }

    public static void startTimingFromEpochMs(Long startEpochMs, String methodName) {
        Instant startTime = startEpochMs != null ? Instant.ofEpochMilli(startEpochMs) : Instant.now();
        startTimingIfAbsent(startTime, methodName);
    }

    /**
     * End timing and return duration in milliseconds
     */
    public static Long endTiming() {
        RequestContextData data = context.get();
        if (data.getStartTime() == null) {
            return null;
        }
        long durationMs = Duration.between(data.getStartTime(), Instant.now()).toMillis();
        return Math.max(durationMs, 0L);
    }

    public static void clear() {
        context.remove();
    }

    private static void startTimingIfAbsent(Instant startTime, String methodName) {
        RequestContextData data = context.get();
        if (data.getStartTime() == null) {
            data.setStartTime(startTime);
        }
        if (methodName != null) {
            data.setMethodName(methodName);
        }
    }

    @Setter
    @Getter
    public static class RequestContextData {
        private Instant startTime;
        private String methodName;
    }
}
