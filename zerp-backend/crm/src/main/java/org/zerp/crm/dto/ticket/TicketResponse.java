package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public record TicketResponse(
                UUID id,
                String title,
                String description,
                String status,
                String priority,
                String type,
                UUID tenantId,
                UUID reporterId,
                LocalDateTime createdAt,
                LocalDateTime updatedAt,
                LocalDateTime resolvedAt,
                LocalDateTime closedAt,
                Set<String> tags,
                Map<String, Object> customAttributes,
                Set<WatcherResponse> watchers,
                List<AttachmentResponse> attachments,
                TicketAssignmentResponse currentAssignment,
                List<CommentResponse> comments,
                SlaTrackingResponse slaTracking) {

        public record SlaTrackingResponse(
                        LocalDateTime firstResponseDueAt,
                        LocalDateTime firstResponseAt,
                        boolean isFirstResponseBreached,
                        LocalDateTime resolutionDueAt,
                        LocalDateTime resolutionAt,
                        boolean isResolutionBreached,
                        int totalPausedTimeMinutes) {
        }
}
