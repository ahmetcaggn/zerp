package org.zerp.gateway.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.zerp.gateway.filter.CustomAuthFilter;
import org.zerp.gateway.filter.RequestContextWebFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class GatewayConfig {

    private final ObjectMapper objectMapper;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // Eğer Cookie ile çalışıyorsan bu önemli

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }

    @Bean
    public RouteLocator gatewayRouter(RouteLocatorBuilder routeLocatorBuilder, CustomAuthFilter authFilter) {

        return routeLocatorBuilder.routes()
                .route(r -> r
                                .path("/email/**")
                                .filters(f -> f
                                                .modifyResponseBody(String.class, String.class, this::attachGatewayDurationToResponseBody)
//                                .filter(authFilter.apply(new CustomAuthFilter.Config()))
                                                .retry(retryConfig -> retryConfig
                                                        .setRetries(3)
                                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                                )
                                )
                                .uri("lb://NOTIFICATION")
                )
                .route(r -> r
                                .path("/employee/**")
                                .filters(f -> f
                                                .modifyResponseBody(String.class, String.class, this::attachGatewayDurationToResponseBody)
//                                .filter(authFilter.apply(new CustomAuthFilter.Config()))
                                                .retry(retryConfig -> retryConfig
                                                        .setRetries(3)
                                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                                )
                                )
                                .uri("lb://EMPLOYEE")
                )
                .route(r -> r
                                .path("/crm/**")

                                .filters(f -> f
                                                .modifyResponseBody(String.class, String.class, this::attachGatewayDurationToResponseBody)
//                                .filter(authFilter.apply(new CustomAuthFilter.Config()))
                                                .retry(retryConfig -> retryConfig
                                                        .setRetries(3)
                                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                                )
                                )
                                .uri("lb://CRM")
                )
                .build();
    }

    private Mono<String> attachGatewayDurationToResponseBody(ServerWebExchange exchange, String responseBody) {
        if (!StringUtils.hasText(responseBody)) {
            return Mono.just(responseBody);
        }

        Long gatewayDurationMs = calculateGatewayDurationMs(exchange);
        if (gatewayDurationMs == null) {
            return Mono.just(responseBody);
        }

        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            if (!rootNode.isObject()) {
                return Mono.just(responseBody);
            }

            JsonNode metaNode = rootNode.get("meta");
            if (!(metaNode instanceof ObjectNode metaObjectNode)) {
                return Mono.just(responseBody);
            }

            metaObjectNode.put("durationMs", gatewayDurationMs);
            return Mono.just(objectMapper.writeValueAsString(rootNode));
        } catch (Exception ignored) {
            return Mono.just(responseBody);
        }
    }

    private Long calculateGatewayDurationMs(ServerWebExchange exchange) {
        String startHeader = exchange.getRequest().getHeaders()
                .getFirst(RequestContextWebFilter.GATEWAY_REQUEST_START_MS_HEADER);
        if (!StringUtils.hasText(startHeader)) {
            return null;
        }

        try {
            long startEpochMs = Long.parseLong(startHeader.trim());
            if (startEpochMs <= 0) {
                return null;
            }

            long durationMs = System.currentTimeMillis() - startEpochMs;
            return Math.max(durationMs, 0L);
        } catch (NumberFormatException ignored) {
            return null;
        }
    }
}
