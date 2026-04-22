package org.zerp.socket_service.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.zerp.socket_service.config.SocketServiceProperties;
import org.zerp.socket_service.exception.WsSecurityException;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class SocketHandshakeInterceptor implements HandshakeInterceptor {

    private final SocketServiceProperties socketServiceProperties;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler webSocketHandler, Map<String, Object> attributes) {
        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            return true;
        }

        HttpServletRequest httpServletRequest = servletRequest.getServletRequest();
        String principalId = resolveIdentity(httpServletRequest, socketServiceProperties.getIdentityHeader());
        if (!StringUtils.hasText(principalId)) {
            throw new WsSecurityException(
                    "Missing websocket identity header: " + socketServiceProperties.getIdentityHeader());
        }

        attributes.put("principalId", principalId.trim());

        String tenantId = resolveIdentity(httpServletRequest, socketServiceProperties.getTenantHeader());
        if (StringUtils.hasText(tenantId)) {
            attributes.put("tenantId", tenantId.trim());
        }

        attributes.put("remoteAddress", request.getRemoteAddress() != null
                ? request.getRemoteAddress().toString()
                : "unknown");
        attributes.put("userAgent", defaultIfBlank(httpServletRequest.getHeader("User-Agent"), "unknown"));
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler webSocketHandler, Exception exception) {
    }

    private String resolveIdentity(HttpServletRequest request, String key) {
        String headerValue = request.getHeader(key);
        if (StringUtils.hasText(headerValue)) {
            return headerValue;
        }
        return request.getParameter(key);
    }

    private String defaultIfBlank(String value, String defaultValue) {
        return StringUtils.hasText(value) ? value : defaultValue;
    }
}
