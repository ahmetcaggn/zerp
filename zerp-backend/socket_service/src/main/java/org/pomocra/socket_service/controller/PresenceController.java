package org.pomocra.socket_service.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.pomocra.socket_service.exception.WsValidationException;
import org.pomocra.socket_service.service.Notification;
import org.pomocra.socket_service.service.PresenceService;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@Log4j2
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;
    private final Notification notification;

    /**
     * Handle heartbeat messages from clients.
     * Fail-safe: logs errors and continues.
     */
    @MessageMapping("/heartbeat")
    public void heartBeat(
            @Header("simpSessionId") String wsSessionId,
            Principal principal) {
        if (principal == null) {
            throw new WsValidationException("Principal is required for heartbeat");
        }

//        log.info("Heartbeat received from user: {} with sessionId: {}", principal.getName(), wsSessionId);
        presenceService.refreshHeartbeat(principal.getName(), wsSessionId);
    }
}
