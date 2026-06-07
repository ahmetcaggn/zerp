package org.zerp.user.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.user.config.PrometheusProperties;
import org.zerp.user.dto.metrics.MetricQueryRangeRequest;
import org.zerp.user.permission.SystemMetricsPermissionEvaluator;
import tools.jackson.databind.JsonNode;

import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@Log4j2
public class SystemMetricsService {
    private static final Pattern STEP_PATTERN = Pattern.compile("^[1-9][0-9]*(s|m|h)$");
    private static final Map<String, String> PROMQL_BY_METRIC_ID = Map.ofEntries(
            Map.entry("docker.cpu", "sum(rate(container_cpu_usage_seconds_total{name!=\"\"}[5m])) by (name, image)"),
            Map.entry("docker.memoryUsage", "sum(container_memory_working_set_bytes{name!=\"\"}) by (name, image)"),
            Map.entry("docker.processesCount", "sum(container_processes{name!=\"\"}) by (name, image)"),
            Map.entry("docker.ioReads", "sum(rate(container_blkio_device_usage_total{name!=\"\",operation=\"Read\"}[5m])) or (sum(container_last_seen{name!=\"\"}) * 0)"),
            Map.entry("docker.ioWrites", "sum(rate(container_blkio_device_usage_total{name!=\"\",operation=\"Write\"}[5m])) or (sum(container_last_seen{name!=\"\"}) * 0)"),
            Map.entry("docker.networkReceived", "sum(rate(container_network_receive_bytes_total{name!=\"\"}[5m])) or (sum(container_last_seen{name!=\"\"}) * 0)"),
            Map.entry("docker.networkSent", "sum(rate(container_network_transmit_bytes_total{name!=\"\"}[5m])) or (sum(container_last_seen{name!=\"\"}) * 0)"),
            Map.entry("docker.containersInfo", "container_last_seen{name!=\"\"}"),
            Map.entry("docker.uptime", "max(time() - container_last_seen{name!=\"\"} < bool 30) by (name, image)"),
            Map.entry("services.jvmHeap", "sum(jvm_memory_used_bytes{area=\"heap\", job=~\"microservices.*\"}) by (instance)"),
            Map.entry("services.requestRate", "sum(rate(http_server_requests_seconds_count{job=~\"microservices.*\"}[5m])) by (instance)"),
            Map.entry("services.errorRate", "sum(rate(http_server_requests_seconds_count{job=~\"microservices.*\", status=~\"5..\"}[5m])) by (instance) or (sum(rate(http_server_requests_seconds_count{job=~\"microservices.*\"}[5m])) by (instance) * 0)"),
            Map.entry("services.dbConnections", "sum(hikaricp_connections{job=~\"microservices.*\"}) by (instance)"),
            Map.entry("services.cpuUsage", "sum(process_cpu_usage{job=~\"microservices.*\"}) by (instance)"),
            Map.entry("services.jvmThreads", "sum(jvm_threads_live_threads{job=~\"microservices.*\"}) by (instance)")
    );

    private final CurrentUserIdResolver currentUserIdResolver;
    private final PrometheusProperties prometheusProperties;
    private final RestClient prometheusClient;
    private final SystemMetricsPermissionEvaluator permissionEvaluator;

    public SystemMetricsService(
            CurrentUserIdResolver currentUserIdResolver,
            PrometheusProperties prometheusProperties,
            SystemMetricsPermissionEvaluator permissionEvaluator
    ) {
        this.currentUserIdResolver = currentUserIdResolver;
        this.prometheusProperties = prometheusProperties;
        this.permissionEvaluator = permissionEvaluator;
        this.prometheusClient = RestClient.builder()
                .baseUrl(prometheusProperties.baseUrl())
                .build();
    }

    public JsonNode queryRange(MetricQueryRangeRequest request) {
        UUID userId = currentUserIdResolver.resolve();

        if (!permissionEvaluator.canRead(userId)) {
            log.warn("User {} attempted to read system metrics without sufficient permissions", userId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read system metrics");
        }

        validateRequest(request);
        String query = PROMQL_BY_METRIC_ID.get(request.metricId());

        try {
            JsonNode response = prometheusClient
                    .get()
                    .uri(
                            "/api/v1/query_range?query={query}&start={start}&end={end}&step={step}",
                            query,
                            request.start(),
                            request.end(),
                            request.step()
                    )
                    .retrieve()
                    .body(JsonNode.class);

            if (response == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Prometheus returned an empty response");
            }

            return response;
        } catch (RestClientResponseException ex) {
            log.warn("Prometheus query failed for metricId {}: status={}", request.metricId(), ex.getStatusCode());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Prometheus query failed", ex);
        }
    }

    private void validateRequest(MetricQueryRangeRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request cannot be null");
        }

        if (!PROMQL_BY_METRIC_ID.containsKey(request.metricId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown metricId");
        }

        if (request.start() <= 0 || request.end() <= 0 || request.end() <= request.start()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid time range");
        }

        long rangeSeconds = request.end() - request.start();
        if (rangeSeconds > prometheusProperties.maxRangeSeconds()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested range is too large");
        }

        if (request.step() == null || !STEP_PATTERN.matcher(request.step()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid step");
        }
    }
}
