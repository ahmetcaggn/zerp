package org.pomocra.socket_service.listener;

import lombok.extern.log4j.Log4j2;
import org.pomocra.socket_service.service.Notification;
import org.pomocra.socket_service.service.PresenceService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
@Log4j2
public class WebSocketEventListener {

    private final PresenceService presenceService;
    private final Notification notification;

    public WebSocketEventListener(PresenceService presenceService, Notification notification) {
        this.presenceService = presenceService;
        this.notification = notification;
    }

    // Handle WebSocket connection event
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
//        // Extract user information from the event
//        Principal user = event.getUser();
//        if (user == null) {
//            return;
//        }
//
//        // Assuming user is of type StompUserPrincipal
//        String userId = user.getName();
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        // Get the WebSocket session ID
//        String wsSessionId = headerAccessor.getSessionId();
//
//        // Check if the user was already online
//        Boolean wasOnline = presenceService.hasAnySession(userId);
//
//        // Register the new connection
//        presenceService.connectUser(userId, wsSessionId);
//
//        // If the user was not online before, notify friends about the ONLINE status
//        if (!wasOnline && presenceService.hasPresenceKey(userId) == Boolean.TRUE) {
//            PresenceStatus status = presenceService.getPresenceStatus(userId);
//            if (status != PresenceStatus.INVISIBLE) {
//                notification.notifyFriends(userId, status.name());
//            }
//        }
    }

    // Handle WebSocket disconnection event
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;

        if (userId != null) {
            presenceService.disconnectUser(userId);
        }
    }
}
