package org.zerp.user.dto.metrics;

public record MetricQueryRangeRequest(
        String metricId,
        long start,
        long end,
        String step
) {
}
