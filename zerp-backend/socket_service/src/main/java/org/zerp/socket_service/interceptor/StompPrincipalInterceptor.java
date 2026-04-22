package org.zerp.socket_service.interceptor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.zerp.socket_service.exception.WsSecurityException;
import org.zerp.socket_service.principal.SocketPrincipal;

import java.util.Map;

@Component
public class StompPrincipalInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }
        if (!StompCommand.CONNECT.equals(accessor.getCommand())) {
            return message;
        }

        Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
        String principalId = sessionAttributes == null ? null : (String) sessionAttributes.get("principalId");
        if (!StringUtils.hasText(principalId)) {
            throw new WsSecurityException("Unauthenticated websocket CONNECT request");
        }

        String tenantId = sessionAttributes == null ? null : (String) sessionAttributes.get("tenantId");
        accessor.setUser(new SocketPrincipal(principalId, accessor.getSessionId(), tenantId));
        return message;
    }
}
