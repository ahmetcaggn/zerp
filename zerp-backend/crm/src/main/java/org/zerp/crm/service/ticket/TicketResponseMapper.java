package org.zerp.crm.service.ticket;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.crm.TicketAssignmentEntity;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.entity.crm.TicketSlaTrackingEntity;
import org.zerp.crm.dto.ticket.AttachmentResponse;
import org.zerp.crm.dto.ticket.CommentResponse;
import org.zerp.crm.dto.ticket.TicketAssignmentResponse;
import org.zerp.crm.dto.ticket.TicketResponse;
import org.zerp.crm.dto.ticket.WatcherResponse;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TicketResponseMapper {

    public TicketResponse toResponse(TicketEntity entity) {
        UUID tenantId = entity.getTenant() != null ? entity.getTenant().getId() : null;
        UUID reporterId = entity.getReporter() != null ? entity.getReporter().getId() : null;

        TicketAssignmentResponse assignmentResponse = getTicketAssignmentResponse(entity);

        Set<WatcherResponse> watcherResponses = entity.getWatchers().stream()
                .map(watcher -> new WatcherResponse(
                        watcher != null ? watcher.getId() : null,
                        watcher != null ? watcher.getAddedAt() : null))
                .collect(Collectors.toSet());

        List<AttachmentResponse> attachmentResponses = entity.getAttachments().stream()
                .map(attachment -> new AttachmentResponse(
                        attachment.getId(),
                        attachment.getFileName(),
                        attachment.getFileSize(),
                        attachment.getContentType(),
                        attachment.getStorageKey(),
                        attachment.getUploadedBy(),
                        attachment.getUploadedAt()))
                .collect(Collectors.toList());

        List<CommentResponse> commentResponses = entity.getComments().stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getAuthor() != null ? comment.getAuthor().getId() : null,
                        comment.getAuthorType().name(),
                        comment.getContent(),
                        comment.getIsInternal(),
                        comment.getCreatedAt(),
                        comment.getAttachments().stream()
                                .map(attachment -> new AttachmentResponse(
                                        attachment.getId(),
                                        attachment.getFileName(),
                                        attachment.getFileSize(),
                                        attachment.getContentType(),
                                        attachment.getStorageKey(),
                                        attachment.getUploadedBy(),
                                        attachment.getUploadedAt()))
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());

        TicketResponse.SlaTrackingResponse slaResponse = getSlaTrackingResponse(entity);

        return new TicketResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus().name(),
                entity.getPriority().name(),
                entity.getType() != null ? entity.getType().name() : null,
                tenantId,
                reporterId,
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getResolvedAt(),
                entity.getClosedAt(),
                entity.getTags(),
                entity.getCustomAttributes(),
                watcherResponses,
                attachmentResponses,
                assignmentResponse,
                commentResponses,
                slaResponse
        );
    }

    private TicketResponse.@Nullable SlaTrackingResponse getSlaTrackingResponse(TicketEntity entity) {
        TicketResponse.SlaTrackingResponse slaResponse = null;
        if (entity.getSlaTracking() != null) {
            TicketSlaTrackingEntity slaTracking = entity.getSlaTracking();
            slaResponse = new TicketResponse.SlaTrackingResponse(
                    slaTracking.getFirstResponseDueAt(),
                    slaTracking.getFirstResponseAt(),
                    Boolean.TRUE.equals(slaTracking.getIsFirstResponseBreached()),
                    slaTracking.getResolutionDueAt(),
                    slaTracking.getResolutionAt(),
                    Boolean.TRUE.equals(slaTracking.getIsResolutionBreached()),
                    slaTracking.getTotalPausedTimeMinutes() != null ? slaTracking.getTotalPausedTimeMinutes() : 0
            );
        }
        return slaResponse;
    }

    @Nullable
    private TicketAssignmentResponse getTicketAssignmentResponse(TicketEntity entity) {
        TicketAssignmentResponse assignmentResponse = null;
        if (entity.getCurrentAssignment() != null) {
            TicketAssignmentEntity assignment = entity.getCurrentAssignment();
            UUID teamId = assignment.getTeam() != null ? assignment.getTeam().getId() : null;
            UUID agentPartyId = assignment.getAgentParty() != null ? assignment.getAgentParty().getId() : null;
            assignmentResponse = new TicketAssignmentResponse(
                    assignment.getId(),
                    teamId,
                    agentPartyId,
                    Boolean.TRUE.equals(assignment.getActive()),
                    assignment.getAssignedAt()
            );
        }
        return assignmentResponse;
    }
}
