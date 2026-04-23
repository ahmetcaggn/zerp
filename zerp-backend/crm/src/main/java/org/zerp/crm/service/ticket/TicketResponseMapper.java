package org.zerp.crm.service.ticket;

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
import java.util.stream.Collectors;

@Component
public class TicketResponseMapper {

    public TicketResponse toResponse(TicketEntity entity) {
        TicketAssignmentResponse assignmentResponse = null;
        if (entity.getCurrentAssignment() != null) {
            TicketAssignmentEntity assignment = entity.getCurrentAssignment();
            assignmentResponse = new TicketAssignmentResponse(
                    assignment.getId(),
                    assignment.getTeamId(),
                    assignment.getAgentPartyId(),
                    Boolean.TRUE.equals(assignment.getActive()),
                    assignment.getAssignedAt()
            );
        }

        Set<WatcherResponse> watcherResponses = entity.getWatchers().stream()
                .map(watcher -> new WatcherResponse(watcher.getWatcherId(), watcher.getAddedAt()))
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
                        comment.getAuthorId(),
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

        return new TicketResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus().name(),
                entity.getPriority().name(),
                entity.getType() != null ? entity.getType().name() : null,
                entity.getTenantId(),
                entity.getReporterId(),
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
}
