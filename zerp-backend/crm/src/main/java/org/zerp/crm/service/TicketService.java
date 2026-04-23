package org.zerp.crm.service;

import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TicketAssignmentEntity;
import org.zerp.common.entity.crm.TicketCommentEntity;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.entity.crm.TicketHistoryEntity;
import org.zerp.common.entity.crm.TicketSlaTrackingEntity;
import org.zerp.common.entity.crm.TicketEntity.TicketPriority;
import org.zerp.common.entity.crm.TicketEntity.TicketStatus;
import org.zerp.common.entity.crm.TicketEntity.TicketType;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.crm.dto.ticket.AddCommentRequest;
import org.zerp.crm.dto.ticket.AssignTicketRequest;
import org.zerp.crm.dto.ticket.ChangePriorityRequest;
import org.zerp.crm.dto.ticket.ChangeStatusRequest;
import org.zerp.crm.dto.ticket.CreateTicketRequest;
import org.zerp.crm.dto.ticket.TicketResponse;
import org.zerp.crm.dto.ticket.UpdateTicketRequest;
import org.zerp.crm.repository.TicketRepository;
import org.zerp.crm.service.ticket.TicketResponseMapper;
import org.zerp.crm.service.ticket.TicketSpecificationBuilder;
import org.zerp.crm.service.ticket.TicketValueParser;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketService implements IResourceService<TicketResponse, TicketResponse,
        CreateTicketRequest, UpdateTicketRequest, UUID> {

    private static final UUID SYSTEM_ACTOR_ID = UUID.fromString("2b9de1ef-3cda-4226-b1e7-e23a178cdb7e");

    private final TicketRepository ticketRepository;
    private final TicketResponseMapper ticketResponseMapper;
    private final TicketSpecificationBuilder ticketSpecificationBuilder;
    private final TicketValueParser ticketValueParser;
    private final EntityManager entityManager;

    public TicketService(
            TicketRepository ticketRepository,
            TicketResponseMapper ticketResponseMapper,
            TicketSpecificationBuilder ticketSpecificationBuilder,
            TicketValueParser ticketValueParser,
            EntityManager entityManager
    ) {
        this.ticketRepository = ticketRepository;
        this.ticketResponseMapper = ticketResponseMapper;
        this.ticketSpecificationBuilder = ticketSpecificationBuilder;
        this.ticketValueParser = ticketValueParser;
        this.entityManager = entityManager;
    }

    // -- Resource service methods --

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> findWithFilters(Map<String, String> filters, Pageable pageable) {
        Specification<TicketEntity> specification = ticketSpecificationBuilder.build(filters);
        return ticketRepository.findAll(specification, pageable).map(ticketResponseMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> findAllById(List<UUID> ids) {
        return ticketRepository.findAllById(ids).stream()
                .map(ticketResponseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse findById(UUID id) {
        return ticketResponseMapper.toResponse(findOrThrow(id));
    }

    @Override
    public TicketResponse create(CreateTicketRequest data) {
        return createTicket(data, SYSTEM_ACTOR_ID);
    }

    @Override
    public TicketResponse patch(UUID id, Map<String, Object> data) {
        TicketEntity entity = findOrThrow(id);
        boolean changed = false;

        if (data.containsKey("title")) {
            entity.setTitle(validateTitle(String.valueOf(data.get("title"))));
            changed = true;
        }

        if (data.containsKey("description")) {
            Object description = data.get("description");
            entity.setDescription(description == null ? null : String.valueOf(description));
            changed = true;
        }

        if (data.containsKey("status")) {
            TicketStatus requestedStatus = ticketValueParser.parseStatus(data.get("status"), "status");
            if (entity.getStatus() != requestedStatus) {
                changeStatusInternal(entity, requestedStatus, SYSTEM_ACTOR_ID);
                changed = true;
            }
        }

        if (data.containsKey("priority")) {
            TicketPriority oldPriority = entity.getPriority();
            TicketPriority newPriority = ticketValueParser.parsePriority(data.get("priority"), "priority");

            if (oldPriority != newPriority) {
                entity.setPriority(newPriority);
                entity.setUpdatedAt(LocalDateTime.now());
                addHistory(entity, TicketHistoryEntity.EventType.PRIORITY_CHANGED, SYSTEM_ACTOR_ID,
                        String.format("Priority changed from %s to %s", oldPriority, newPriority));
                changed = true;
            }
        }

        if (data.containsKey("type")) {
            Object typeValue = data.get("type");
            entity.setType(typeValue == null ? null : ticketValueParser.parseType(typeValue, "type"));
            changed = true;
        }

        if (data.containsKey("tenantId")) {
            entity.setTenant(toTenantReference(ticketValueParser.parseNullableUuid(data.get("tenantId"), "tenantId")));
            changed = true;
        }

        if (data.containsKey("reporterId")) {
            entity.setReporter(toAppUserReference(ticketValueParser.parseNullableUuid(data.get("reporterId"), "reporterId")));
            changed = true;
        }

        if (data.containsKey("tags")) {
            entity.setTags(ticketValueParser.parseStringSet(data.get("tags"), "tags"));
            changed = true;
        }

        if (data.containsKey("customAttributes")) {
            entity.setCustomAttributes(ticketValueParser.parseMap(data.get("customAttributes"), "customAttributes"));
            changed = true;
        }

        if (changed) {
            entity.setUpdatedAt(LocalDateTime.now());
        }

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    @Override
    public TicketResponse update(UUID id, UpdateTicketRequest data) {
        TicketEntity entity = findOrThrow(id);
        entity.setTitle(validateTitle(data.title()));
        entity.setDescription(data.description());
        entity.setUpdatedAt(LocalDateTime.now());

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    @Override
    public List<UUID> patchMany(List<UUID> ids, Map<String, Object> fields) {
        List<UUID> updated = new ArrayList<>();
        for (UUID id : ids) {
            try {
                patch(id, fields);
                updated.add(id);
            } catch (IllegalArgumentException ignored) {
            }
        }
        return updated;
    }

    @Override
    public void deleteById(UUID id) {
        TicketEntity entity = findOrThrow(id);
        ticketRepository.delete(entity);
    }

    @Override
    public List<UUID> deleteMany(List<UUID> ids) {
        List<UUID> deleted = new ArrayList<>();
        for (UUID id : ids) {
            try {
                deleteById(id);
                deleted.add(id);
            } catch (IllegalArgumentException ignored) {
            }
        }
        return deleted;
    }

    // -- compatibility and business methods --

    public TicketResponse createTicket(CreateTicketRequest request, UUID actorId) {
        TicketPriority priority = request.priority() != null ? request.priority() : TicketPriority.MEDIUM;
        TicketType type = request.type() != null ? request.type() : TicketType.QUESTION;

        TicketEntity entity = new TicketEntity();
        entity.setTitle(validateTitle(request.title()));
        entity.setDescription(request.description());
        entity.setStatus(TicketStatus.OPEN);
        entity.setPriority(priority);
        entity.setType(type);
        entity.setTenant(toTenantReference(request.tenantId()));
        entity.setReporter(toAppUserReference(actorId));
        entity.setCreatedAt(LocalDateTime.now());

        initializeSla(entity, priority);
        addHistory(entity, TicketHistoryEntity.EventType.CREATED, actorId,
                String.format("Ticket created with priority: %s", priority));

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(UUID ticketId) {
        return findById(ticketId);
    }

    public TicketResponse changeStatus(UUID ticketId, ChangeStatusRequest request, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        TicketStatus newStatus = request.status();
        TicketStatus oldStatus = entity.getStatus();

        if (oldStatus == newStatus) {
            return ticketResponseMapper.toResponse(entity);
        }

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

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse changePriority(UUID ticketId, ChangePriorityRequest request, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        TicketPriority oldPriority = entity.getPriority();
        TicketPriority newPriority = request.priority();

        if (oldPriority == newPriority) {
            return ticketResponseMapper.toResponse(entity);
        }

        entity.setPriority(newPriority);
        entity.setUpdatedAt(LocalDateTime.now());

        addHistory(entity, TicketHistoryEntity.EventType.PRIORITY_CHANGED, actorId,
                String.format("Priority changed from %s to %s", oldPriority, newPriority));

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse assignTicket(UUID ticketId, AssignTicketRequest request, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        validateAssignable(entity);

        boolean isReassignment = entity.getCurrentAssignment() != null
                && Boolean.TRUE.equals(entity.getCurrentAssignment().getActive());

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

        TicketAssignmentEntity assignment = new TicketAssignmentEntity();
        assignment.setTicket(entity);
        assignment.setTeam(toTeamReference(request.teamId()));
        assignment.setAgentParty(toAppUserReference(request.agentPartyId()));
        assignment.setAssignedByParty(toAppUserReference(actorId));
        assignment.setActive(true);
        assignment.setReason(request.agentPartyId() != null ? "Assigned to agent" : "Assigned to team");
        assignment.setAssignedAt(LocalDateTime.now());
        entity.setCurrentAssignment(assignment);

        if (!isReassignment) {
            String target = request.agentPartyId() != null
                    ? String.format("Assigned to agent %s", request.agentPartyId())
                    : String.format("Ticket assigned to team: %s", request.teamId());
            addHistory(entity, TicketHistoryEntity.EventType.ASSIGNED, actorId, target);
        }

        if (entity.getStatus() == TicketStatus.OPEN) {
            changeStatusInternal(entity, TicketStatus.IN_PROGRESS, actorId);
        }
        entity.setUpdatedAt(LocalDateTime.now());

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse unassignTicket(UUID ticketId, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);

        if (entity.getCurrentAssignment() != null
                && Boolean.TRUE.equals(entity.getCurrentAssignment().getActive())) {
            TicketAssignmentEntity assignment = entity.getCurrentAssignment();

            String assignmentTarget = assignment.getAgentParty() != null
                    ? "agent " + assignment.getAgentParty().getId()
                    : assignment.getTeam() != null ? "team " + assignment.getTeam().getId() : "team";

            assignment.setActive(false);
            assignment.setUnassignedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());

            addHistory(entity, TicketHistoryEntity.EventType.UNASSIGNED, actorId,
                    String.format("Ticket unassigned from %s", assignmentTarget));

            changeStatusInternal(entity, TicketStatus.OPEN, actorId);
        }

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse addComment(UUID ticketId, AddCommentRequest request, UUID actorId) {
        TicketEntity entity = findOrThrow(ticketId);
        validateCommentable(entity);

        boolean isInternal = request.isInternal() != null && request.isInternal();

        TicketCommentEntity comment = new TicketCommentEntity();
        comment.setTicket(entity);
        comment.setAuthor(toAppUserReference(actorId));
        comment.setAuthorType(TicketCommentEntity.AuthorType.AGENT);
        comment.setContent(request.content());
        comment.setIsInternal(isInternal);
        comment.setCreatedAt(LocalDateTime.now());

        entity.getComments().add(comment);
        entity.setUpdatedAt(LocalDateTime.now());

        if (!isInternal && entity.getSlaTracking() != null
                && entity.getSlaTracking().getFirstResponseAt() == null) {
            entity.getSlaTracking().setFirstResponseAt(LocalDateTime.now());
            entity.getSlaTracking().setIsFirstResponseBreached(
                    LocalDateTime.now().isAfter(entity.getSlaTracking().getFirstResponseDueAt()));
        }

        addHistory(entity, TicketHistoryEntity.EventType.COMMENT_ADDED, actorId,
                String.format("Comment added by %s", TicketCommentEntity.AuthorType.AGENT));

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse closeTicket(UUID ticketId, UUID actorId) {
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
        return ticketResponseMapper.toResponse(saved);
    }

    // -- Internal Helpers --

    private void changeStatusInternal(TicketEntity entity, TicketStatus newStatus, UUID actorId) {
        TicketStatus oldStatus = entity.getStatus();
        if (oldStatus == newStatus) {
            return;
        }

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

    private TicketEntity findOrThrow(UUID ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found: " + ticketId));
    }

    private Tenant toTenantReference(UUID tenantId) {
        if (tenantId == null) {
            return null;
        }
        return entityManager.getReference(Tenant.class, tenantId);
    }

    private TeamEntity toTeamReference(UUID teamId) {
        if (teamId == null) {
            return null;
        }
        return entityManager.getReference(TeamEntity.class, teamId);
    }

    private AppUser toAppUserReference(UUID userId) {
        if (userId == null) {
            return null;
        }
        return entityManager.getReference(AppUser.class, userId);
    }

    private void validateAssignable(TicketEntity entity) {
        if (entity.getStatus() == TicketStatus.CLOSED || entity.getStatus() == TicketStatus.CANCELLED) {
            throw new IllegalStateException("Cannot assign a closed or cancelled ticket");
        }
    }

    private void validateCommentable(TicketEntity entity) {
        if (entity.getStatus() == TicketStatus.CLOSED || entity.getStatus() == TicketStatus.CANCELLED) {
            throw new IllegalStateException("Cannot make a comment on a closed or cancelled ticket");
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
        history.setActorParty(toAppUserReference(actorId));
        history.setPayload(payload);
        history.setOccurredAt(LocalDateTime.now());
        entity.getHistory().add(history);
    }
}
