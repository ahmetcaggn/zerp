package org.zerp.socket_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.zerp.socket_service.exception.WsValidationException;
import org.zerp.socket_service.service.RedisSocketRegistry;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class SocketHeartbeatController {

    private final RedisSocketRegistry redisSocketRegistry;

    @MessageMapping("/system/heartbeat")
    public void heartbeat(@Header("simpSessionId") String sessionId, Principal principal) {
        if (principal == null || !StringUtils.hasText(principal.getName())) {
            throw new WsValidationException("Principal is required for heartbeat");
        }
        if (!StringUtils.hasText(sessionId)) {
            throw new WsValidationException("Session id is required for heartbeat");
        }
        redisSocketRegistry.touchSession(sessionId);
    }
}
