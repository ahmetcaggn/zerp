package org.zerp.socket_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.socket_service.dto.DestinationSubscriptionSummary;
import org.zerp.socket_service.dto.SocketSessionSnapshot;
import org.zerp.socket_service.dto.UserSessionSnapshot;
import org.zerp.socket_service.service.RedisSocketRegistry;

@RestController
@RequestMapping("/internal/socket")
@RequiredArgsConstructor
public class SocketRegistryController {

    private final RedisSocketRegistry redisSocketRegistry;

    @GetMapping("/sessions/{sessionId}")
    public SocketSessionSnapshot getSession(@PathVariable String sessionId) {
        return redisSocketRegistry.getSessionSnapshot(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    }

    @GetMapping("/users/{userId}/sessions")
    public UserSessionSnapshot getUserSessions(@PathVariable String userId) {
        return new UserSessionSnapshot(userId, redisSocketRegistry.getUserSessions(userId));
    }

    @GetMapping("/destinations/summary")
    public DestinationSubscriptionSummary getDestinationSummary(@RequestParam String destination) {
        return redisSocketRegistry.getDestinationSummary(destination);
    }
}
