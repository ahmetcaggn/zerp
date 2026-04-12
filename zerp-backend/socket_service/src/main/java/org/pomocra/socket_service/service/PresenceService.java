package org.pomocra.socket_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@Log4j2
@RequiredArgsConstructor
public class PresenceService {

    private final StringRedisTemplate stringRedisTemplate;

    @Value("${presence.timeout:90}")
    private Long timeout;

    /**
     * Handle user connection by storing session info in Redis.
     * Fail-safe: logs error and continues if Redis is unavailable.
     */
    public void connectUser(String userId, String sessionId) {
//        try {
//            if (sessionId == null) {
//                throw new WsPresenceException("Session id is required to get online friends");
//            }
//            if (userId == null) {
//                throw new WsPresenceException("User id is required to get online friends");
//            }
//
//            String sessionKeyPattern = "user:session:" + userId + ":" + sessionId; // Key pattern for storing individual session
//            String presenceKeyPattern = "user:presence:" + userId; // Key pattern for storing user's presence status
//
//            // Store session info in Redis with a timeout to automatically expire if the user disconnects without proper cleanup
//            stringRedisTemplate.opsForValue().set(sessionKeyPattern, "1", timeout, TimeUnit.SECONDS);
//            log.debug("User {} connected with session {}", userId, sessionId);
//
//            // Check if the presence key already exists before setting it, to avoid unnecessary Redis operations and to
//            // respect existing presence status if the user has multiple sessions
//            if (!stringRedisTemplate.hasKey(presenceKeyPattern)) {
//                PrivacyOnlineSettingsDto settings = getPrivacySettings(userId);
//                PresenceStatus status = settings.getPresenceStatus();
//
//                if (status == null) {
//                    status = PresenceStatus.INVISIBLE; // Null safety
//                }
//
//                // Only set the presence key if the user is not invisible, to respect their privacy settings
//                if (status != PresenceStatus.INVISIBLE) {
//                    stringRedisTemplate.opsForValue().set(presenceKeyPattern, status.name());
//                    log.debug("User {} presence key set in Redis to {}", userId, status.name());
//                } else {
//                    log.debug("User {} has presence status INVISIBLE, skipping presence key creation", userId);
//                }
//            } else {
//                log.debug("User {} presence key already exists or online privacy is disabled", userId);
//            }
//        } catch (RedisConnectionFailureException e) {
//            log.error("Redis connection failed while connecting user {}: {}", userId, e.getMessage());
//        } catch (Exception e) {
//            log.error("Unexpected error connecting user {}: {}", userId, e.getMessage(), e);
//        }
    }

    /**
     * Handle user disconnection.
     */
    public void disconnectUser(String userId) {
        log.info("User {} disconnected.", userId);
    }

    /**
     * Refresh the heartbeat for a user's session.
     * Fail-safe: logs error and continues if Redis is unavailable.
     */
    public void refreshHeartbeat(String userId, String sessionId) {
//        try {
//            if (sessionId == null) {
//                throw new WsPresenceException("Session id is required to refresh heartbeat");
//            }
//            if (userId == null) {
//                throw new WsPresenceException("User id is required to refresh heartbeat");
//            }
//            String sessionKeyPattern = "user:session:" + userId + ":" + sessionId;
//            Boolean result = stringRedisTemplate.expire(sessionKeyPattern, timeout, TimeUnit.SECONDS);
//            if (result) {
//                log.debug("Heartbeat refreshed for user {} with session {}", userId, sessionId);
//            } else {
//                log.warn("Heartbeat refresh failed - key not found for user {} session {}", userId, sessionId);
//            }
//        } catch (RedisConnectionFailureException e) {
//            log.error("Redis connection failed while refreshing heartbeat for user {}: {}", userId, e.getMessage());
//        } catch (Exception e) {
//            log.error("Unexpected error refreshing heartbeat for user {}: {}", userId, e.getMessage(), e);
//        }
    }

    /**
     * Check if the user has any active sessions.
     * Fail-safe: returns false if Redis is unavailable.
     */
//    public Boolean hasAnySession(String userId) {
//        try {
//            if (userId == null) {
//                throw new WsPresenceException("User id is required to check sessions");
//            }
//            String sessionKeyPattern = "user:session:" + userId + ":*";
//            Set<String> keys = stringRedisTemplate.keys(sessionKeyPattern);
//            boolean hasSession = keys != null && !keys.isEmpty();
//            log.debug("hasAnySession check for userId {}: hasSession={}", userId, hasSession);
//            return hasSession;
//        } catch (RedisConnectionFailureException e) {
//            log.error("Redis connection failed while checking sessions for user {}: {}", userId, e.getMessage());
//            return false;
//        } catch (Exception e) {
//            log.error("Unexpected error checking sessions for user {}: {}", userId, e.getMessage(), e);
//            return false;
//        }
//    }

    /**
     * Check if the user has a presence key in Redis, indicating they are online.
     * Fail-safe: returns false if Redis is unavailable.
     */
//    public Boolean hasPresenceKey(String userId) {
//        try {
//            if (userId == null) {
//                throw new WsPresenceException("User id is required to check presence key");
//            }
//            String presenceKeyPattern = "user:presence:" + userId;
//            Boolean hasKey = stringRedisTemplate.hasKey(presenceKeyPattern);
//            log.debug("hasPresenceKey check for userId {}: hasKey={}", userId, hasKey);
//            return Boolean.TRUE.equals(hasKey);
//        } catch (RedisConnectionFailureException e) {
//            log.error("Redis connection failed while checking presence key for user {}: {}", userId, e.getMessage());
//            return false;
//        } catch (Exception e) {
//            log.error("Unexpected error checking presence key for user {}: {}", userId, e.getMessage(), e);
//            return false;
//        }
//    }

    /**
     * Check if the user has enabled online privacy settings.
     * Fail-safe: returns false if user profile service is unavailable.
     */
//    public PrivacyOnlineSettingsDto getPrivacySettings(String userId) {
//        try {
//            if (userId == null) {
//                throw new WsPresenceException("User id is required to get privacy settings");
//            }
//            PrivacyOnlineSettingsDto settings = userProfileServiceClient.getPrivacyOnlineSettings(Long.parseLong(userId)).getData();
//            log.debug("Fetched privacy settings for userId {}: {}", userId, settings);
//            return settings;
//        } catch (Exception e) {
//            log.error("Error fetching privacy settings for user {}: {}", userId, e.getMessage(), e);
//            return new PrivacyOnlineSettingsDto(PresenceStatus.INVISIBLE); // Return default settings if there's an error
//        }
//    }

    /**
     * Get the user's current presence status from Redis.
     * Fail-safe: returns INVISIBLE if Redis is unavailable or if the user has no presence key.
     */
//    public PresenceStatus getPresenceStatus(String userId) {
//        try {
//            if (userId == null) return PresenceStatus.INVISIBLE;
//
//            String presenceKeyPattern = "user:presence:" + userId;
//            String status = stringRedisTemplate.opsForValue().get(presenceKeyPattern);
//
//            return status != null ? PresenceStatus.valueOf(status) : PresenceStatus.INVISIBLE;
//        } catch (Exception e) {
//            log.error("Error fetching presence status for user {}: {}", userId, e.getMessage());
//            return PresenceStatus.INVISIBLE;
//        }
//    }
}
