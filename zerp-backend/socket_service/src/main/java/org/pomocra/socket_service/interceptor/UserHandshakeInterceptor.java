package org.pomocra.socket_service.interceptor;

import org.pomocra.socket_service.exception.WsSecurityException;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class UserHandshakeInterceptor implements HandshakeInterceptor {

    // Extract user ID from headers during handshake and store in attributes
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Map<String, Object> attributes) {

        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            return true;
        }

        String userId = servletRequest.getServletRequest().getHeader("x-user-id");
        if (userId == null || userId.isEmpty()) {
            throw new WsSecurityException("User id is required");
        }

        attributes.put("userId", userId);
        return true;
    }

    // No action needed after handshake
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Exception exception) {
    }
}
