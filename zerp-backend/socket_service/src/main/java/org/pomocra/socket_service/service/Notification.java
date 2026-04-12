package org.pomocra.socket_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Log4j2
public class Notification {

    private final PresenceService presenceService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    /**
     * Notify friends about user's status change.
     * Fail-safe: logs errors and continues if external service is unavailable.
     */
    public void notifyFriends(String userId, String status) {
//        log.info("notifyFriends called for userId: {} with status: {}", userId, status);
//        try {
//            // Fetch friend IDs from user service
//            ApiResponse<Set<Long>> friendIds = userFriendServiceClient.getUserFriendIds(Long.parseLong(userId));
//
//            // Validate response and handle nulls gracefully
//            if (friendIds == null || friendIds.getData() == null) {
//                log.warn("No friend data returned for user {}", userId);
//                return;
//            }
//
//            // Convert friend IDs to String set for presence checks and notifications
//            Set<String> friendIdsStr = friendIds.getData().stream()
//                    .map(String::valueOf)
//                    .collect(Collectors.toSet());
//
//            // Notify each friend who has an active session about the user's status change
//            for (String friendId : friendIdsStr) {
//                try {
//                    boolean hasSession = presenceService.hasAnySession(friendId);
//                    if (hasSession) {
//                        simpMessagingTemplate.convertAndSendToUser(
//                                friendId,
//                                "/queue/presence",
//                                Map.of("userId", userId, "status", status));
//                    }
//                } catch (MessagingException e) {
//                    log.error("Failed to send presence notification to friend {}: {}", friendId, e.getMessage());
//                }
//            }
//        } catch (FeignException e) {
//            throw new WsInternalException(
//                    "Failed to fetch friend IDs for user " + userId + " from user service: " + e.getMessage());
//        } catch (NumberFormatException e) {
//            log.error("Invalid userId format: {}", userId);
//        } catch (Exception e) {
//            log.error("Unexpected error notifying friends for user {}: {}", userId, e.getMessage(), e);
//        }
    }

    /**
     * Send the list of online friends to the user upon connection.
     * Fail-safe: sends empty list if errors occur.
     */
    public void sendInitialOnlineFriends(String userId) {
//        try {
//            // Fetch friend IDs from user service
//            ApiResponse<Set<Long>> friendIds = userFriendServiceClient.getUserFriendIds(Long.parseLong(userId));
//
//            // Validate response and handle nulls gracefully
//            if (friendIds == null || friendIds.getData() == null) {
//                log.warn("No friend data returned for user {}, sending empty map", userId);
//                sendEmptyPresenceInit(userId);
//                return;
//            }
//
//            // Create a map of online friends with their presence status
//            Map<String, String> onlineFriends = friendIds.getData().stream()
//                    .map(String::valueOf)
//                    .filter(presenceService::hasAnySession) // Only consider friends who have active sessions
//                    .filter(presenceService::hasPresenceKey) // Only consider friends who have presence keys (i.e., not invisible)
//                    .collect(Collectors.toMap(
//                            friendId -> friendId,
//                            friendId -> presenceService.getPresenceStatus(friendId).name()
//                    ));
//
//            simpMessagingTemplate.convertAndSendToUser(
//                    userId,
//                    "/queue/presence-init",
//                    onlineFriends);
//
//        } catch (FeignException e) {
//            throw new WsInternalException("Failed to fetch friend IDs for presence-init user: " + userId);
//        } catch (MessagingException e) {
//            log.error("Failed to send presence-init to user {}: {}", userId, e.getMessage());
//        } catch (NumberFormatException e) {
//            log.error("Invalid userId format: {}", userId);
//        } catch (Exception e) {
//            log.error("Unexpected error sending initial online friends to user {}: {}", userId, e.getMessage(), e);
//            sendEmptyPresenceInit(userId);
//        }
    }

    /**
     * Helper method to send empty presence-init to user.
     */
    private void sendEmptyPresenceInit(String userId) {
//        try {
//            // Send an empty map to indicate no online friends or an error occurred
//            simpMessagingTemplate.convertAndSendToUser(userId, "/queue/presence-init", Collections.emptyMap());
//        } catch (Exception e) {
//            log.error("Failed to send empty presence-init to user {}: {}", userId, e.getMessage());
//        }
    }
}
