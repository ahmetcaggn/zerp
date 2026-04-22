package org.zerp.gateway.filter;

import lombok.extern.log4j.Log4j2;
import org.jspecify.annotations.NullMarked;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
@Log4j2
public class RequestContextWebFilter implements WebFilter, Ordered {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    public static final String CLIENT_IP_HEADER = "X-Client-Ip";
    public static final String GATEWAY_REQUEST_START_MS_HEADER = "X-Gateway-Request-Start-Ms";

    // Uncomment if you want to track total time spent in the gateway (including downstream calls) instead of just
    // request processing time in the gateway.
    // public static final String GATEWAY_DURATION_MS_HEADER = "X-Gateway-Duration-Ms";

    private static final String CORRELATION_ID_MDC_KEY = "correlationId";
    private static final String CLIENT_IP_MDC_KEY = "clientIp";

    @Override
    @NullMarked
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String existingCorrelationId = exchange.getRequest().getHeaders().getFirst(CORRELATION_ID_HEADER);
        String correlationId = StringUtils.hasText(existingCorrelationId) ? existingCorrelationId : UUID.randomUUID().toString();
        String gatewayRequestStartMs = resolveRequestStartMs(
                exchange.getRequest().getHeaders().getFirst(GATEWAY_REQUEST_START_MS_HEADER)
        );
        String clientIp = resolveClientIp(exchange);

        ServerHttpRequest mutatedRequest = exchange.getRequest()
                .mutate()
                .headers(headers -> {
                    headers.set(CORRELATION_ID_HEADER, correlationId);
                    headers.set(GATEWAY_REQUEST_START_MS_HEADER, gatewayRequestStartMs);
                    if (StringUtils.hasText(clientIp)) {
                        headers.set(CLIENT_IP_HEADER, clientIp);
                    }
                })
                .build();

        ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

        MDC.put(CORRELATION_ID_MDC_KEY, correlationId);
        if (StringUtils.hasText(clientIp)) {
            MDC.put(CLIENT_IP_MDC_KEY, clientIp);
        }

        return chain.filter(mutatedExchange)
                .doFinally(_ -> {
                    MDC.remove(CORRELATION_ID_MDC_KEY);
                    MDC.remove(CLIENT_IP_MDC_KEY);
                });
    }

    private String resolveClientIp(ServerWebExchange exchange) {
        String forwardedFor = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            return forwardedFor.split(",")[0].trim();
        }

        if (exchange.getRequest().getRemoteAddress() != null
                && exchange.getRequest().getRemoteAddress().getAddress() != null) {
            return exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
        }

        return null;
    }

    private String resolveRequestStartMs(String gatewayRequestStartMs) {
        if (StringUtils.hasText(gatewayRequestStartMs)) {
            try {
                long parsed = Long.parseLong(gatewayRequestStartMs.trim());
                if (parsed > 0) {
                    return Long.toString(parsed);
                }
            } catch (NumberFormatException ignored) {
                // Fallback to current time when header is invalid.
            }
        }
        return Long.toString(System.currentTimeMillis());
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
