package org.zerp.employee.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerp.common.context.RequestContext;

import java.io.IOException;
import java.util.UUID;

@Component
public class RequestContextServletFilter extends OncePerRequestFilter {

    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    private static final String CLIENT_IP_HEADER = "X-Client-Ip";
    private static final String GATEWAY_REQUEST_START_MS_HEADER = "X-Gateway-Request-Start-Ms";
    private static final String CORRELATION_ID_MDC_KEY = "correlationId";
    private static final String CLIENT_IP_MDC_KEY = "clientIp";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        Long gatewayRequestStartMs = parseEpochMs(request.getHeader(GATEWAY_REQUEST_START_MS_HEADER));
        RequestContext.startTimingFromEpochMs(gatewayRequestStartMs, request.getMethod() + " " + request.getRequestURI());

        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        String clientIp = resolveClientIp(request);
        if (!StringUtils.hasText(correlationId)) {
            correlationId = UUID.randomUUID().toString();
        }

        MDC.put(CORRELATION_ID_MDC_KEY, correlationId);
        if (StringUtils.hasText(clientIp)) {
            MDC.put(CLIENT_IP_MDC_KEY, clientIp);
        }
        response.setHeader(CORRELATION_ID_HEADER, correlationId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove(CORRELATION_ID_MDC_KEY);
            MDC.remove(CLIENT_IP_MDC_KEY);
            RequestContext.clear();
        }
    }

    private String resolveClientIp(HttpServletRequest request) {
        String clientIp = request.getHeader(CLIENT_IP_HEADER);
        if (StringUtils.hasText(clientIp)) {
            return clientIp;
        }

        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private Long parseEpochMs(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            long parsed = Long.parseLong(value.trim());
            return parsed > 0 ? parsed : null;
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
