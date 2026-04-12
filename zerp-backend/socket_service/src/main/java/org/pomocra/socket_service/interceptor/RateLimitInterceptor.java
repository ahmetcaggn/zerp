package org.pomocra.socket_service.interceptor;

import lombok.extern.log4j.Log4j2;
import org.pomocra.socket_service.exception.WsRateLimitException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate limiting interceptor for WebSocket messages.
 * Limits the number of messages per user per time window.
 */
@Component
@Log4j2
public class RateLimitInterceptor implements ChannelInterceptor {

    // Rate limit: max messages per window
    @Value("${app.websocket.rateLimit.maxMessagesPerMinute:60}")
    private int MAX_MESSAGES_PER_WINDOW;

    // Time window in milliseconds (1 minute)
    @Value("${app.websocket.rateLimit.timeWindowMs:60000}")
    private long TIME_WINDOW_MS;

    // Store rate limit data per user session
    private final Map<String, RateLimitData> rateLimitMap = new ConcurrentHashMap<>();

    // Intercept messages to enforce rate limiting
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // Validate accessor and command
        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }

        // Only rate limit SEND commands (user-initiated messages)
        if (!StompCommand.SEND.equals(accessor.getCommand())) {
            return message;
        }

        // Get session ID
        if (accessor.getSessionId() == null) {
            return message;
        }

        // Get user principal
        if (accessor.getUser() == null) {
            return message;
        }

        // Bypass rate limiting for heartbeat messages
        if ("/app/heartbeat".equals(accessor.getDestination())) {
            return message;
        }

        String userId = accessor.getUser().getName();

        // Get or create rate limit data for this session
        RateLimitData data =
                rateLimitMap.computeIfAbsent(userId, k -> new RateLimitData());

        // Check if we need to reset the window
        long now = System.currentTimeMillis();
        if (now - data.windowStart > TIME_WINDOW_MS) {
            data.reset(now);
        }

        // Check rate limit
        int count = data.messageCount.incrementAndGet();
        if (count > MAX_MESSAGES_PER_WINDOW) {
            log.warn("Rate limit exceeded for userId={} count={} messages in window", userId, count);
            throw new WsRateLimitException("Rate limit exceeded. Please slow down.");
        }

        return message;
    }

    /**
     * Clean up rate limit data when user disconnects
     */
    public void cleanupUser(String userId) {
        rateLimitMap.remove(userId);
    }

    // Data structure to hold rate limit info per user session
    private static class RateLimitData {
        volatile long windowStart = System.currentTimeMillis();
        final AtomicInteger messageCount = new AtomicInteger(0);

        void reset(long newWindowStart) {
            this.windowStart = newWindowStart;
            this.messageCount.set(0);
        }
    }
}
