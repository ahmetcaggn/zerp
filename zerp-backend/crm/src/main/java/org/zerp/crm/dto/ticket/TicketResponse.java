package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;
import java.util.List;

public record TicketResponse(
                Integer id,
                String title,
                String description,
                String status,
                String priority,
                Integer tenantId,
                Integer createdByPartyId,
                LocalDateTime createdAt,
                LocalDateTime updatedAt,
                LocalDateTime resolvedAt,
                LocalDateTime closedAt,
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
