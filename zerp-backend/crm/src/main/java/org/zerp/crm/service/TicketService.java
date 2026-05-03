package org.zerp.crm.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.crm.TeamMemberEntity;
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
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterErrorUtils;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.crm.permission.CrmPermissionEvaluator;
import org.zerp.crm.dto.ticket.AddCommentRequest;
import org.zerp.crm.dto.ticket.AssignTicketRequest;
import org.zerp.crm.dto.ticket.ChangePriorityRequest;
import org.zerp.crm.dto.ticket.ChangeStatusRequest;
import org.zerp.crm.dto.ticket.CreateTicketRequest;
import org.zerp.crm.dto.ticket.TicketResponse;
import org.zerp.crm.dto.ticket.UpdateTicketRequest;
import org.zerp.crm.repository.TeamMemberRepository;
import org.zerp.crm.repository.TicketRepository;
import org.zerp.crm.service.ticket.TicketResponseMapper;
import org.zerp.crm.service.ticket.TicketValueParser;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Log4j2
@Service
@Transactional
@RequiredArgsConstructor
public class TicketService implements IResourceService<TicketResponse, TicketResponse,
        CreateTicketRequest, UpdateTicketRequest, UUID> {

    private static final Set<String> EDIT_LOCKED_PATCH_FIELDS = Set.of(
            "title", "description", "type", "tags", "customAttributes"
    );
    private static final Set<TeamMemberEntity.TeamMemberRole> AGENT_TEAM_MEMBER_ROLES = Set.of(
            TeamMemberEntity.TeamMemberRole.LEADER,
            TeamMemberEntity.TeamMemberRole.MEMBER
    );
    private static final String REFERENCE_TYPE_TICKET = "TICKET";
    private static final String REFERENCE_TYPE_TICKET_ASSIGNMENT = "TICKET_ASSIGNMENT";
    private static final String REFERENCE_TYPE_TICKET_COMMENT = "TICKET_COMMENT";
    private static final String REFERENCE_TYPE_TEAM = "TEAM";

    private final TicketRepository ticketRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TicketResponseMapper ticketResponseMapper;
    private final TicketValueParser ticketValueParser;
    private final EntityManager entityManager;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;
    private final CrmPermissionEvaluator permissionEvaluator;

    @Value("${app.crm.system-tenant-id:00000000-0000-0000-0000-000000000000}")
    private UUID systemTenantId;

    // -- Resource service methods --

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = resolveCurrentUserIdOrThrow();
        Specification<TicketEntity> specification = permissionEvaluator
                .filterReadTickets(userId)
                .and(buildSpecificationFromFilters(filters));
        try {
            return ticketRepository.findAll(specification, pageable).map(ticketResponseMapper::toResponse);
        } catch (DataAccessException e) {
            if (e.getCause() instanceof FilterError.Runtime fe) {
                log.warn("Filter error while processing filters {}: {}", filters, fe.getMessage(), e);
                throw FilterErrorUtils.toResponseStatusException(fe.getError());
            }
            log.error("Unexpected error while processing filters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            log.error("Unexpected error while processing filters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter parameters: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> findAllById(List<UUID> ids) {
        UUID userId = resolveCurrentUserIdOrThrow();
        return ticketRepository.findAllById(ids).stream()
                .filter(ticket -> permissionEvaluator.canReadTicket(userId, toTicketTarget(ticket)))
                .map(ticketResponseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse findById(UUID id) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(id);
        ensureCanReadTicket(userId, entity);
        return ticketResponseMapper.toResponse(entity);
    }

    @Override
    public TicketResponse create(CreateTicketRequest data) {
        return createTicket(data);
    }

    @Override
    public TicketResponse patch(UUID id, Map<String, Object> data) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(id);
        ensureCanUpdateTicket(userId, entity);
        Map<String, Object> patchData = data == null ? Map.of() : data;
        ensureTicketEditableForFields(entity, patchData.keySet());
        boolean changed = false;

        if (patchData.containsKey("title")) {
            entity.setTitle(validateTitle(String.valueOf(patchData.get("title"))));
            changed = true;
        }

        if (patchData.containsKey("description")) {
            Object description = patchData.get("description");
            entity.setDescription(description == null ? null : String.valueOf(description));
            changed = true;
        }

        if (patchData.containsKey("status")) {
            TicketStatus requestedStatus = ticketValueParser.parseStatus(patchData.get("status"), "status");
            if (entity.getStatus() != requestedStatus) {
                changeStatusInternal(entity, requestedStatus);
                changed = true;
            }
        }

        if (patchData.containsKey("priority")) {
            TicketPriority oldPriority = entity.getPriority();
            TicketPriority newPriority = ticketValueParser.parsePriority(patchData.get("priority"), "priority");

            if (oldPriority != newPriority) {
                entity.setPriority(newPriority);
                entity.setUpdatedAt(LocalDateTime.now());
                addHistory(entity, TicketHistoryEntity.EventType.PRIORITY_CHANGED,
                        String.format("Priority changed from %s to %s", oldPriority, newPriority));
                changed = true;
            }
        }

        if (patchData.containsKey("type")) {
            Object typeValue = patchData.get("type");
            entity.setType(typeValue == null ? null : ticketValueParser.parseType(typeValue, "type"));
            changed = true;
        }

        if (patchData.containsKey("reporterId")) {
            entity.setReporter(toAppUserReference(ticketValueParser.parseNullableUuid(patchData.get("reporterId"), "reporterId")));
            changed = true;
        }

        if (patchData.containsKey("tags")) {
            entity.setTags(ticketValueParser.parseStringSet(patchData.get("tags"), "tags"));
            changed = true;
        }

        if (patchData.containsKey("customAttributes")) {
            entity.setCustomAttributes(ticketValueParser.parseMap(patchData.get("customAttributes"), "customAttributes"));
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
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(id);
        ensureCanUpdateTicket(userId, entity);
        ensureTicketEditable(entity);
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
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(id);
        ensureCanDeleteTicket(userId, entity);
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

    public TicketResponse createTicket(CreateTicketRequest request) {
        TicketPriority priority = request.priority() != null ? request.priority() : TicketPriority.MEDIUM;
        TicketType type = request.type() != null ? request.type() : TicketType.QUESTION;
        UUID tenantId = request.tenantId();
        if (tenantId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tenantId is required");
        }

        UUID userId = resolveCurrentUserIdOrThrow();
        ensureCanCreateTicket(userId, tenantId);

        TicketEntity entity = new TicketEntity();
        entity.setTitle(validateTitle(request.title()));
        entity.setDescription(request.description());
        entity.setStatus(TicketStatus.OPEN);
        entity.setPriority(priority);
        entity.setType(type);
        entity.setTenantId(tenantId);
        entity.setReporter(toAppUserReference(userId));
        entity.setCreatedAt(LocalDateTime.now());

        initializeSla(entity, priority);
        TicketEntity saved = ticketRepository.save(entity);
        addHistory(saved, TicketHistoryEntity.EventType.CREATED,
                String.format("Ticket created with priority: %s", priority),
                REFERENCE_TYPE_TICKET,
                saved.getId());
        saved = ticketRepository.save(saved);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse changeStatus(UUID ticketId, ChangeStatusRequest request) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);
        ensureCanUpdateTicket(userId, entity);
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
            addHistory(entity, TicketHistoryEntity.EventType.REOPENED, null);
        }

        addHistory(entity, TicketHistoryEntity.EventType.STATUS_CHANGED,
                String.format("Status changed from %s to %s", oldStatus, newStatus));

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse changePriority(UUID ticketId, ChangePriorityRequest request) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);
        ensureCanUpdateTicket(userId, entity);
        TicketPriority oldPriority = entity.getPriority();
        TicketPriority newPriority = request.priority();

        if (oldPriority == newPriority) {
            return ticketResponseMapper.toResponse(entity);
        }

        entity.setPriority(newPriority);
        entity.setUpdatedAt(LocalDateTime.now());

        addHistory(entity, TicketHistoryEntity.EventType.PRIORITY_CHANGED,
                String.format("Priority changed from %s to %s", oldPriority, newPriority));

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse assignTicket(UUID ticketId, AssignTicketRequest request) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);
        ensureCanCreateTicketAssignment(userId, entity);
        validateAssignable(entity);
        TeamEntity assignmentTeam = resolveAssignmentTeamOrThrow(request);
        AppUser assignmentAgent = resolveAssignmentAgentOrThrow(request, assignmentTeam);

        TicketAssignmentEntity assignment = entity.getCurrentAssignment();
        boolean hasExistingAssignment = assignment != null;
        boolean isReassignment = hasExistingAssignment && Boolean.TRUE.equals(assignment.getActive());

        if (!hasExistingAssignment) {
            assignment = new TicketAssignmentEntity();
            entity.setCurrentAssignment(assignment);
        } else if (isReassignment) {
            String target = request.agentPartyId() != null
                    ? "agent " + request.agentPartyId()
                    : "team " + request.teamId();
            addHistory(entity, TicketHistoryEntity.EventType.REASSIGNED,
                    String.format("Reassigned to %s", target),
                    REFERENCE_TYPE_TICKET_ASSIGNMENT,
                    assignment.getId());
        }

        assignment.setTicket(entity);
        assignment.setTeam(assignmentTeam);
        assignment.setAgentParty(assignmentAgent);
        assignment.setAssignedByParty(toAppUserReference(userId));
        assignment.setActive(true);
        assignment.setReason(assignmentAgent != null ? "Assigned to agent" : "Assigned to team");
        assignment.setAssignedAt(LocalDateTime.now());
        assignment.setUnassignedAt(null);
        assignment.setTenantId(entity.getTenantId());

        if (!hasExistingAssignment) {
            entityManager.persist(assignment);
        }

        if (!isReassignment) {
            String target = request.agentPartyId() != null
                    ? String.format("Assigned to agent %s", request.agentPartyId())
                    : String.format("Ticket assigned to team: %s", request.teamId());
            addHistory(entity, TicketHistoryEntity.EventType.ASSIGNED, target,
                    REFERENCE_TYPE_TEAM, request.teamId());
        }

        if (entity.getStatus() == TicketStatus.OPEN) {
            changeStatusInternal(entity, TicketStatus.IN_PROGRESS);
        }
        entity.setUpdatedAt(LocalDateTime.now());

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse unassignTicket(UUID ticketId) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);

        if (entity.getCurrentAssignment() != null
                && Boolean.TRUE.equals(entity.getCurrentAssignment().getActive())) {
            TicketAssignmentEntity assignment = entity.getCurrentAssignment();
            ensureCanUpdateTicketAssignment(userId, entity, assignment);

            String assignmentTarget = assignment.getAgentParty() != null
                    ? "agent " + assignment.getAgentParty().getId()
                    : assignment.getTeam() != null ? "team " + assignment.getTeam().getId() : "team";

            assignment.setActive(false);
            assignment.setUnassignedAt(LocalDateTime.now());
            entity.setUpdatedAt(LocalDateTime.now());

            addHistory(entity, TicketHistoryEntity.EventType.UNASSIGNED,
                    String.format("Ticket unassigned from %s", assignmentTarget),
                    REFERENCE_TYPE_TICKET_ASSIGNMENT,
                    assignment.getId());

            changeStatusInternal(entity, TicketStatus.OPEN);
        }

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse addComment(UUID ticketId, AddCommentRequest request) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);
        ensureCanCreateTicketComment(userId, entity);
        validateCommentable(entity);
        UUID tenantId = entity.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant not found");
        }

        boolean isInternal = request.isInternal() != null && request.isInternal();
        UUID requesterTenantId = currentTenantIdResolver.resolve();
        if (requesterTenantId == null) {
            throw new IllegalStateException("Requester tenant not found");
        }
        TicketCommentEntity.AuthorType authorType = resolveCommentAuthorType(userId, requesterTenantId);

        TicketCommentEntity comment = new TicketCommentEntity();
        comment.setTicket(entity);
        comment.setAuthor(toAppUserReference(userId));
        comment.setAuthorType(authorType);
        comment.setContent(request.content());
        comment.setIsInternal(isInternal);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setTenantId(tenantId);

        entity.getComments().add(comment);
        entity.setUpdatedAt(LocalDateTime.now());

        if (!isInternal && entity.getSlaTracking() != null
                && entity.getSlaTracking().getFirstResponseAt() == null) {
            entity.getSlaTracking().setFirstResponseAt(LocalDateTime.now());
            entity.getSlaTracking().setIsFirstResponseBreached(
                    LocalDateTime.now().isAfter(entity.getSlaTracking().getFirstResponseDueAt()));
        }

        TicketEntity saved = ticketRepository.save(entity);
        addHistory(saved, TicketHistoryEntity.EventType.COMMENT_ADDED,
                String.format("Comment added by %s", authorType),
                REFERENCE_TYPE_TICKET_COMMENT,
                comment.getId());
        saved = ticketRepository.save(saved);
        return ticketResponseMapper.toResponse(saved);
    }

    public TicketResponse closeTicket(UUID ticketId) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);
        ensureCanUpdateTicket(userId, entity);
        TicketStatus oldStatus = entity.getStatus();

        if (!oldStatus.canTransitionTo(TicketStatus.CLOSED)) {
            throw new IllegalStateException(
                    String.format("Cannot transition from %s to %s", oldStatus, TicketStatus.CLOSED));
        }

        entity.setStatus(TicketStatus.CLOSED);
        entity.setClosedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        addHistory(entity, TicketHistoryEntity.EventType.STATUS_CHANGED,
                String.format("Status changed from %s to %s", oldStatus, TicketStatus.CLOSED));

        TicketEntity saved = ticketRepository.save(entity);
        return ticketResponseMapper.toResponse(saved);
    }

    // -- Internal Helpers --

    private void changeStatusInternal(TicketEntity entity, TicketStatus newStatus) {
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
            addHistory(entity, TicketHistoryEntity.EventType.REOPENED, null);
        }

        addHistory(entity, TicketHistoryEntity.EventType.STATUS_CHANGED,
                String.format("Status changed from %s to %s", oldStatus, newStatus));
    }

    private TicketEntity findOrThrow(UUID ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found: " + ticketId));
    }

    private AppUser toAppUserReference(UUID userId) {
        if (userId == null) {
            return null;
        }
        return entityManager.getReference(AppUser.class, userId);
    }

    private TeamEntity resolveAssignmentTeamOrThrow(AssignTicketRequest request) {
        if (request == null || request.teamId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "teamId is required");
        }

        TeamEntity team = entityManager.find(TeamEntity.class, request.teamId());
        if (team == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team not found: " + request.teamId());
        }

        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        if (!resolvedSystemTenantId.equals(team.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team must belong to system tenant");
        }

        return team;
    }

    private AppUser resolveAssignmentAgentOrThrow(AssignTicketRequest request, TeamEntity team) {
        UUID agentId = request != null ? request.agentPartyId() : null;
        if (agentId == null) {
            return null;
        }

        AppUser agent = entityManager.find(AppUser.class, agentId);
        if (agent == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agent not found: " + agentId);
        }

        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        if (!resolvedSystemTenantId.equals(agent.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agent must belong to system tenant");
        }

        if (!teamMemberRepository.existsByTeamIdAndUserId(team.getId(), agentId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agent is not a member of the selected team");
        }

        return agent;
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

    private void ensureTicketEditableForFields(TicketEntity entity, Set<String> fields) {
        if (fields == null || fields.isEmpty()) {
            return;
        }
        boolean touchesEditableField = fields.stream().anyMatch(EDIT_LOCKED_PATCH_FIELDS::contains);
        if (touchesEditableField) {
            ensureTicketEditable(entity);
        }
    }

    private void ensureTicketEditable(TicketEntity entity) {
        if (entity.getStatus() == TicketStatus.IN_PROGRESS) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ticket cannot be edited after it is in progress"
            );
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
        UUID tenantId = entity.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant not found");
        }
        TicketSlaTrackingEntity sla = new TicketSlaTrackingEntity();
        sla.setTicket(entity);
        LocalDateTime now = LocalDateTime.now();
        sla.setFirstResponseDueAt(now.plusMinutes(priority.getDefaultResponseTimeMinutes()));
        sla.setResolutionDueAt(now.plusMinutes(priority.getDefaultResponseTimeMinutes() * 4L));
        sla.setIsFirstResponseBreached(false);
        sla.setIsResolutionBreached(false);
        sla.setIsPaused(false);
        sla.setTotalPausedTimeMinutes(0);
        sla.setTenantId(tenantId);
        entity.setSlaTracking(sla);
    }

    private void recordSlaResolution(TicketEntity entity) {
        if (entity.getSlaTracking() != null && entity.getSlaTracking().getResolutionAt() == null) {
            entity.getSlaTracking().setResolutionAt(LocalDateTime.now());
            entity.getSlaTracking().setIsResolutionBreached(
                    LocalDateTime.now().isAfter(entity.getSlaTracking().getResolutionDueAt()));
        }
    }

    private void addHistory(TicketEntity entity, TicketHistoryEntity.EventType eventType, String payload) {
        addHistory(entity, eventType, payload, REFERENCE_TYPE_TICKET, entity != null ? entity.getId() : null);
    }

    private void addHistory(
            TicketEntity entity,
            TicketHistoryEntity.EventType eventType,
            String payload,
            String referenceType,
            UUID referenceId) {
        UUID userId = resolveCurrentUserIdOrThrow();
        UUID tenantId = entity.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant not found");
        }
        TicketHistoryEntity history = new TicketHistoryEntity();
        history.setTicket(entity);
        history.setEventType(eventType);
        history.setActorParty(toAppUserReference(userId));
        history.setTenantId(tenantId);
        history.setReferenceType(referenceType != null && !referenceType.isBlank()
                ? referenceType
                : REFERENCE_TYPE_TICKET);
        history.setReferenceId(resolveHistoryReferenceId(entity, referenceId, userId));
        history.setPayload(payload);
        history.setOccurredAt(LocalDateTime.now());
        entity.getHistory().add(history);
    }

    private UUID resolveHistoryReferenceId(TicketEntity entity, UUID referenceId, UUID userId) {
        if (referenceId != null) {
            return referenceId;
        }
        if (entity != null && entity.getId() != null) {
            return entity.getId();
        }
        return userId;
    }

    private TicketCommentEntity.AuthorType resolveCommentAuthorType(UUID userId, UUID tenantId) {
        boolean isAgent = teamMemberRepository.existsByUserAndTenantAndRoleIn(
                userId, tenantId, AGENT_TEAM_MEMBER_ROLES);
        return isAgent ? TicketCommentEntity.AuthorType.AGENT : TicketCommentEntity.AuthorType.CUSTOMER;
    }

    private Specification<TicketEntity> buildSpecificationFromFilters(Map<String, String> filters) {
        log.debug("Building specification from filters: {}", filters);
        Specification<TicketEntity> spec = filterRefiner.refinedOrBadRequest(filters, TicketEntity.class);
        log.debug("Built specification from filters: {}", spec);
        return spec;
    }

    private CrmPermissionEvaluator.TicketTarget toTicketTarget(TicketEntity ticket) {
        return new CrmPermissionEvaluator.TicketTarget(ticket.getId(), ticket.getTenantId());
    }

    private CrmPermissionEvaluator.TicketParent toTicketParent(TicketEntity ticket) {
        return new CrmPermissionEvaluator.TicketParent(ticket.getId(), ticket.getTenantId());
    }

    private CrmPermissionEvaluator.TicketChildTarget toTicketAssignmentTarget(
            TicketEntity ticket,
            TicketAssignmentEntity assignment
    ) {
        return new CrmPermissionEvaluator.TicketChildTarget(
                assignment != null ? assignment.getId() : null,
                ticket.getId(),
                ticket.getTenantId()
        );
    }

    private void ensureCanReadTicket(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canReadTicket(userId, toTicketTarget(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Ticket");
        }
    }

    private void ensureCanCreateTicket(UUID userId, UUID tenantId) {
        if (!permissionEvaluator.canCreateTicket(userId, new CrmPermissionEvaluator.TenantParent(tenantId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Ticket");
        }
    }

    private void ensureCanUpdateTicket(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canUpdateTicket(userId, toTicketTarget(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Ticket");
        }
    }

    private void ensureCanDeleteTicket(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canDeleteTicket(userId, toTicketTarget(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Ticket");
        }
    }

    private void ensureCanCreateTicketComment(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canCreateTicketComment(userId, toTicketParent(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Ticket comment");
        }
    }

    private void ensureCanCreateTicketAssignment(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canCreateTicketAssignment(userId, toTicketParent(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Ticket assignment");
        }
    }

    private void ensureCanUpdateTicketAssignment(UUID userId, TicketEntity ticket, TicketAssignmentEntity assignment) {
        if (!permissionEvaluator.canUpdateTicketAssignment(userId, toTicketAssignmentTarget(ticket, assignment))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Ticket assignment");
        }
    }

    private UUID resolveSystemTenantIdOrThrow() {
        if (systemTenantId == null) {
            throw new IllegalStateException("System tenant is not configured");
        }
        return systemTenantId;
    }

    private UUID resolveCurrentUserIdOrThrow() {
        UUID userId = currentUserIdResolver.resolve();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing user context");
        }
        return userId;
    }
}
