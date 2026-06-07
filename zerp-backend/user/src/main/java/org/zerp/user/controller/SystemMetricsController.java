package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.ApiResponse;
import org.zerp.user.dto.metrics.MetricQueryRangeRequest;
import org.zerp.user.service.SystemMetricsService;
import tools.jackson.databind.JsonNode;

@RestController
@RequestMapping("/user/admin/metrics")
@RequiredArgsConstructor
@Tag(name = "System Metrics", description = "API for reading admin system metrics")
public class SystemMetricsController {
    private final SystemMetricsService service;

    @GetMapping("/query-range")
    ResponseEntity<ApiResponse<JsonNode>> queryRange(
            @RequestParam(name = "metricId") String metricId,
            @RequestParam(name = "start") long start,
            @RequestParam(name = "end") long end,
            @RequestParam(name = "step") String step
    ) {
        MetricQueryRangeRequest request = new MetricQueryRangeRequest(metricId, start, end, step);
        return ResponseEntity.ok(ApiResponse.success(service.queryRange(request)));
    }
}
