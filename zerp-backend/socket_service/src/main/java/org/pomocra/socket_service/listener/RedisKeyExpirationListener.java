package org.pomocra.socket_service.listener;

import lombok.extern.log4j.Log4j2;
import org.pomocra.socket_service.interceptor.RateLimitInterceptor;
import org.pomocra.socket_service.service.Notification;
import org.pomocra.socket_service.service.PresenceService;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@Log4j2
public class RedisKeyExpirationListener extends KeyExpirationEventMessageListener {

    private final Notification notification;
    private final StringRedisTemplate stringRedisTemplate;
    private final RateLimitInterceptor rateLimitInterceptor;
    private final PresenceService presenceService;

    public RedisKeyExpirationListener(
            RedisMessageListenerContainer listenerContainer,
            Notification notification,
            StringRedisTemplate stringRedisTemplate, RateLimitInterceptor rateLimitInterceptor, PresenceService presenceService) {
        super(listenerContainer);
        this.notification = notification;
        this.stringRedisTemplate = stringRedisTemplate;
        this.rateLimitInterceptor = rateLimitInterceptor;
        this.presenceService = presenceService;
    }

    // Called when a key expires
    @Override
    public void onMessage(Message message, byte[] pattern) {
//        String expiredKey = message.toString();
////        log.info("Redis key expired: {}", expiredKey);
//
//        if (!expiredKey.startsWith("user:session:"))
//            return;
//
//        // Key format: user:session:{userId}:{sessionId}
//        String[] parts = expiredKey.split(":");
//        if (parts.length < 3) return;
//
//        String userId = parts[2];
//
//        // Check if there are any other active sessions for the user
//        Set<String> keys = stringRedisTemplate.keys("user:session:" + userId + ":*");
//
//        // If no more sessions, notify friends that user is OFFLINE
//        if (keys.isEmpty() && presenceService.hasPresenceKey(userId)) {
//            Boolean deleted = stringRedisTemplate.delete("user:presence:" + userId);
//            if (Boolean.TRUE.equals(deleted)) {
//                notification.notifyFriends(userId, "OFFLINE");
//                rateLimitInterceptor.cleanupUser(userId);
//            }
//            log.info("User {} has no more sessions, notifying friends of OFFLINE status", userId);
//        }
//        log.info("Processed expiration for key: {}, userId: {}", expiredKey, userId);
    }
}
