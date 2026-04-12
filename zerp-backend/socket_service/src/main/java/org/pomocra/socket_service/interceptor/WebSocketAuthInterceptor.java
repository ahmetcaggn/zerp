package org.pomocra.socket_service.interceptor;

import org.pomocra.socket_service.exception.WsSecurityException;
import org.pomocra.socket_service.principal.StompUserPrincipal;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    // Intercept STOMP CONNECT messages to set the user principal
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String userId = (String) accessor.getSessionAttributes().get("userId");
            String sessionId = accessor.getSessionId();
            if (userId == null) {
                throw new WsSecurityException("Unauthenticated WebSocket CONNECT");
            }

            accessor.setUser(new StompUserPrincipal(userId, sessionId));
        }

        return message;
    }
}
