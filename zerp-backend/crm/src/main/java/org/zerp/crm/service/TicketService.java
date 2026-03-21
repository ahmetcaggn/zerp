package org.zerp.crm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerp.common.entity.crm.*;
import org.zerp.common.entity.crm.TicketEntity.TicketPriority;
import org.zerp.common.entity.crm.TicketEntity.TicketStatus;
import org.zerp.common.entity.crm.TicketEntity.TicketType;
import org.zerp.common.entity.crm.TicketCommentEntity.AuthorType;
import org.zerp.crm.dto.ticket.*;
import org.zerp.crm.repository.TicketRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public TicketResponse createTicket(CreateTicketRequest request, UUID actorId) {
        TicketPriority priority = request.priority() != null ? request.priority() : TicketPriority.MEDIUM;
        TicketType type = request.type() != null ? request.type() : TicketType.QUESTION;

        TicketEntity entity = new TicketEntity();
        entity.setTitle(validateTitle(request.title()));
        entity.setDescription(request.description());
        entity.setStatus(TicketStatus.OPEN);
        entity.setPriority(priority);
        entity.setType(type);
        entity.setTenantId(request.tenantId());
        entity.setReporterId(actorId);
        entity.setCreatedAt(LocalDateTime.now());

        // SLA initialization
        initializeSla(entity, priority);

        // History: created
        addHistory(entity, TicketHistoryEntity.EventType.CREATED, actorId,
                String.format("Ticket created with priority: %s", priority));

        TicketEntity saved = ticketRepository.save(entity);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(Integer ticketId) {
        TicketEntity entity = findOrThrow(ticketId);
        return toResponse(entity);
    }

    public TicketResponse changeStatus(Integer ticketId, ChangeStatusRequest request, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        TicketStatus newStatus = request.status();
        TicketStatus oldStatus = entity.getStatus();

        if (oldStatus == newStatus) {
            return toResponse(entity);
        }

        if (!oldStatus.canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                    String.format("Cannot transition from %s to %s", oldStatus, newStatus));
        }

        entity.setStatus(newStatus);
        entity.setUpdatedAt(LocalDateTime.now());

        // Special cases
        if (newStatus == TicketStatus.RESOLVED) {
            entity.setResolvedAt(LocalDateTime.now());
            recordSlaResolution(entity);
        } else if (newStatus == TicketStatus.CLOSED) {
            entity.setClosedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.OPEN && oldStatus == TicketStatus.RESOLVED) {
            entity.setResolvedAt(null);
            addHistory(entity, TicketHistoryEntity.EventType.REOPENED, actorId, null);
        }

        addHistory(entity, TicketHistoryEntity.EventType.STATUS_CHANGED, actorId,
                String.format("Status changed from %s to %s", oldStatus, newStatus));

        TicketEntity saved = ticketRepository.save(entity);
        return toResponse(saved);
    }

    public TicketResponse changePriority(Integer ticketId, ChangePriorityRequest request, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        TicketPriority oldPriority = entity.getPriority();
        TicketPriority newPriority = request.priority();

        if (oldPriority == newPriority) {
            return toResponse(entity);
        }

        entity.setPriority(newPriority);
        entity.setUpdatedAt(LocalDateTime.now());

        addHistory(entity, TicketHistoryEntity.EventType.PRIORITY_CHANGED, actorId,
                String.format("Priority changed from %s to %s", oldPriority, newPriority));

        TicketEntity saved = ticketRepository.save(entity);
        return toResponse(saved);
    }

    public TicketResponse assignTicket(Integer ticketId, AssignTicketRequest request, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        validateAssignable(entity);

        boolean isReassignment = entity.getCurrentAssignment() != null
                && Boolean.TRUE.equals(entity.getCurrentAssignment().getActive());

        // Deactivate existing assignment
        if (isReassignment) {
            TicketAssignmentEntity old = entity.getCurrentAssignment();
            old.setActive(false);
            old.setUnassignedAt(LocalDateTime.now());

            String target = request.agentPartyId() != null
                    ? "agent " + request.agentPartyId()
                    : "team " + request.teamId();
            addHistory(entity, TicketHistoryEntity.EventType.REASSIGNED, actorId,
                    String.format("Reassigned to %s", target));
        }

        // Create new assignment
        TicketAssignmentEntity assignment = new TicketAssignmentEntity();
        assignment.setTicket(entity);
        assignment.setTeamId(request.teamId());
        assignment.setAgentPartyId(request.agentPartyId());
        assignment.setAssignedByPartyId(actorId);
        assignment.setActive(true);
        assignment.setReason(request.agentPartyId() != null ? "Assigned to agent" : "Assigned to team");
        assignment.setAssignedAt(LocalDateTime.now());
        entity.setCurrentAssignment(assignment);

        // First assignment audit
        if (!isReassignment) {
            String target = request.agentPartyId() != null
                    ? String.format("Assigned to agent %s", request.agentPartyId())
                    : String.format("Ticket assigned to team: %s", request.teamId());
            addHistory(entity, TicketHistoryEntity.EventType.ASSIGNED, actorId, target);
        }

        // Auto-transition to IN_PROGRESS
        if (entity.getStatus() == TicketStatus.OPEN) {
            changeStatusInternal(entity, TicketStatus.IN_PROGRESS, actorId);
        }
        entity.setUpdatedAt(LocalDateTime.now());

        TicketEntity saved = ticketRepository.save(entity);
        return toResponse(saved);
    }

    public TicketResponse unassignTicket(Integer ticketId, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);

        if (entity.getCurrentAssignment() != null
                && Boolean.TRUE.equals(entity.getCurrentAssignment().getActive())) {
            TicketAssignmentEntity assignment = entity.getCurrentAssignment();

            String assignmentTarget = assignment.getAgentPartyId() != null
                    ? "agent " + assignment.getAgentPartyId()
                    : "team " + assignment.getTeamId();

            assignment.setActive(false);
            assignment.setUnassignedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());

            addHistory(entity, TicketHistoryEntity.EventType.UNASSIGNED, actorId,
                    String.format("Ticket unassigned from %s", assignmentTarget));

            changeStatusInternal(entity, TicketStatus.OPEN, actorId);
        }

        TicketEntity saved = ticketRepository.save(entity);
        return toResponse(saved);
    }

    public TicketResponse addComment(Integer ticketId, AddCommentRequest request, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        validateCommentable(entity);

        boolean isInternal = request.isInternal() != null && request.isInternal();

        TicketCommentEntity comment = new TicketCommentEntity();
        comment.setTicket(entity);
        comment.setAuthorId(actorId);
        comment.setAuthorType(AuthorType.AGENT);
        comment.setContent(request.content());
        comment.setIsInternal(isInternal);
        comment.setCreatedAt(LocalDateTime.now());

        entity.getComments().add(comment);
        entity.setUpdatedAt(LocalDateTime.now());

        // SLA First Response Tracking
        if (!isInternal && entity.getSlaTracking() != null
                && entity.getSlaTracking().getFirstResponseAt() == null) {
            entity.getSlaTracking().setFirstResponseAt(LocalDateTime.now());
            entity.getSlaTracking().setIsFirstResponseBreached(
                    LocalDateTime.now().isAfter(entity.getSlaTracking().getFirstResponseDueAt()));
        }

        addHistory(entity, TicketHistoryEntity.EventType.COMMENT_ADDED, actorId,
                String.format("Comment added by %s", AuthorType.AGENT));

        TicketEntity saved = ticketRepository.save(entity);
        return toResponse(saved);
    }

    public TicketResponse closeTicket(Integer ticketId, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        TicketStatus oldStatus = entity.getStatus();

        if (!oldStatus.canTransitionTo(TicketStatus.CLOSED)) {
            throw new IllegalStateException(
                    String.format("Cannot transition from %s to %s", oldStatus, TicketStatus.CLOSED));
        }

        entity.setStatus(TicketStatus.CLOSED);
        entity.setClosedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        addHistory(entity, TicketHistoryEntity.EventType.STATUS_CHANGED, actorId,
                String.format("Status changed from %s to %s", oldStatus, TicketStatus.CLOSED));

        TicketEntity saved = ticketRepository.save(entity);
        return toResponse(saved);
    }

    // ─── Internal Helpers ───

    private void changeStatusInternal(TicketEntity entity, TicketStatus newStatus, UUID actorId) {
        TicketStatus oldStatus = entity.getStatus();
        if (oldStatus == newStatus) return;

        if (!oldStatus.canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                    String.format("Cannot transition from %s to %s", oldStatus, newStatus));
        }

        entity.setStatus(newStatus);
        entity.setUpdatedAt(LocalDateTime.now());

        if (newStatus == TicketStatus.RESOLVED) {
            entity.setResolvedAt(LocalDateTime.now());
            recordSlaResolution(entity);
        } else if (newStatus == TicketStatus.CLOSED) {
            entity.setClosedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.OPEN && oldStatus == TicketStatus.RESOLVED) {
            entity.setResolvedAt(null);
            addHistory(entity, TicketHistoryEntity.EventType.REOPENED, actorId, null);
        }

        addHistory(entity, TicketHistoryEntity.EventType.STATUS_CHANGED, actorId,
                String.format("Status changed from %s to %s", oldStatus, newStatus));
    }

    private TicketEntity findOrThrow(Integer ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
    }

    private void validateAssignable(TicketEntity entity) {
        if (entity.getStatus() == TicketStatus.CLOSED || entity.getStatus() == TicketStatus.CANCELLED) {
            throw new IllegalStateException("Cannot assign a closed or cancelled ticket");
        }
    }

    private void validateCommentable(TicketEntity entity) {
        if (entity.getStatus() == TicketStatus.CLOSED || entity.getStatus() == TicketStatus.CANCELLED) {
            throw new IllegalStateException("Cannot make a comment or cancelled ticket");
        }
    }

    private String validateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Ticket title cannot be empty");
        }
        if (title.length() > 200) {
            throw new IllegalArgumentException("Ticket title is too long (max 200 characters)");
        }
        return title.trim();
    }

    private void initializeSla(TicketEntity entity, TicketPriority priority) {
        TicketSlaTrackingEntity sla = new TicketSlaTrackingEntity();
        sla.setTicket(entity);
        LocalDateTime now = LocalDateTime.now();
        sla.setFirstResponseDueAt(now.plusMinutes(priority.getDefaultResponseTimeMinutes()));
        sla.setResolutionDueAt(now.plusMinutes(priority.getDefaultResponseTimeMinutes() * 4L));
        sla.setIsFirstResponseBreached(false);
        sla.setIsResolutionBreached(false);
        sla.setIsPaused(false);
        sla.setTotalPausedTimeMinutes(0);
        entity.setSlaTracking(sla);
    }

    private void recordSlaResolution(TicketEntity entity) {
        if (entity.getSlaTracking() != null && entity.getSlaTracking().getResolutionAt() == null) {
            entity.getSlaTracking().setResolutionAt(LocalDateTime.now());
            entity.getSlaTracking().setIsResolutionBreached(
                    LocalDateTime.now().isAfter(entity.getSlaTracking().getResolutionDueAt()));
        }
    }

    private void addHistory(TicketEntity entity, TicketHistoryEntity.EventType eventType,
                            UUID actorId, String payload) {
        TicketHistoryEntity history = new TicketHistoryEntity();
        history.setTicket(entity);
        history.setEventType(eventType);
        history.setActorPartyId(actorId);
        history.setPayload(payload);
        history.setOccurredAt(LocalDateTime.now());
        entity.getHistory().add(history);
    }

    // ─── Response Mapping ───

    private TicketResponse toResponse(TicketEntity entity) {
        TicketAssignmentResponse assignmentResponse = null;
        if (entity.getCurrentAssignment() != null) {
            TicketAssignmentEntity a = entity.getCurrentAssignment();
            assignmentResponse = new TicketAssignmentResponse(
                    a.getId(), a.getTeamId(), a.getAgentPartyId(),
                    Boolean.TRUE.equals(a.getActive()), a.getAssignedAt());
        }

        Set<WatcherResponse> watcherResponses = entity.getWatchers().stream()
                .map(w -> new WatcherResponse(w.getWatcherId(), w.getAddedAt()))
                .collect(Collectors.toSet());

        List<AttachmentResponse> attachmentResponses = entity.getAttachments().stream()
                .map(a -> new AttachmentResponse(a.getId(), a.getFileName(), a.getFileSize(),
                        a.getContentType(), a.getStorageKey(), a.getUploadedBy(), a.getUploadedAt()))
                .collect(Collectors.toList());

        List<CommentResponse> commentResponses = entity.getComments().stream()
                .map(c -> new CommentResponse(
                        c.getId(), c.getAuthorId(), c.getAuthorType().name(),
                        c.getContent(), c.getIsInternal(), c.getCreatedAt(),
                        c.getAttachments().stream()
                                .map(a -> new AttachmentResponse(a.getId(), a.getFileName(), a.getFileSize(),
                                        a.getContentType(), a.getStorageKey(), a.getUploadedBy(), a.getUploadedAt()))
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());

        TicketResponse.SlaTrackingResponse slaResponse = null;
        if (entity.getSlaTracking() != null) {
            TicketSlaTrackingEntity s = entity.getSlaTracking();
            slaResponse = new TicketResponse.SlaTrackingResponse(
                    s.getFirstResponseDueAt(), s.getFirstResponseAt(),
                    Boolean.TRUE.equals(s.getIsFirstResponseBreached()),
                    s.getResolutionDueAt(), s.getResolutionAt(),
                    Boolean.TRUE.equals(s.getIsResolutionBreached()),
                    s.getTotalPausedTimeMinutes() != null ? s.getTotalPausedTimeMinutes() : 0);
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
                slaResponse);
    }
}
