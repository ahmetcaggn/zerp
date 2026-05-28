package org.zerp.crm.service;

import feign.FeignException;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.crm.IssueType;
import org.zerp.common.entity.crm.TeamMemberEntity;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TicketAssignmentEntity;
import org.zerp.common.entity.crm.TicketAttachmentEntity;
import org.zerp.common.entity.crm.TicketCommentEntity;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.entity.crm.TicketHistoryEntity;
import org.zerp.common.entity.crm.TicketSlaTrackingEntity;
import org.zerp.common.entity.crm.TicketWatcherEntity;
import org.zerp.common.entity.crm.TicketEntity.TicketPriority;
import org.zerp.common.entity.crm.TicketEntity.TicketStatus;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterErrorUtils;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.crm.feign.ThumborFeignClient;
import org.zerp.crm.permission.CrmPermissionEvaluator;
import org.zerp.crm.dto.ticket.AddCommentRequest;
import org.zerp.crm.dto.ticket.AssignmentTeamCandidateResponse;
import org.zerp.crm.dto.ticket.AssignmentTeamMemberCandidateResponse;
import org.zerp.crm.dto.ticket.AttachmentResponse;
import org.zerp.crm.dto.ticket.AssignTicketRequest;
import org.zerp.crm.dto.ticket.ChangePriorityRequest;
import org.zerp.crm.dto.ticket.ChangeStatusRequest;
import org.zerp.crm.dto.ticket.CommentResponse;
import org.zerp.crm.dto.ticket.CreateTicketRequest;
import org.zerp.crm.dto.ticket.TicketAttachmentContentResponse;
import org.zerp.crm.dto.ticket.TicketResponse;
import org.zerp.crm.dto.ticket.UpdateTicketRequest;
import org.zerp.crm.dto.ticket.WatcherResponse;
import org.zerp.crm.repository.TeamMemberRepository;
import org.zerp.crm.repository.TeamRepository;
import org.zerp.crm.repository.TicketRepository;
import org.zerp.crm.service.ticket.TicketResponseMapper;
import org.zerp.crm.service.ticket.TicketValueParser;
import org.zerp.s3repository.dto.S3FileDTO;
import org.zerp.s3repository.repository.S3ImageRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
    private static final String DEFAULT_CONTENT_TYPE = MediaType.APPLICATION_OCTET_STREAM_VALUE;

    private final TicketRepository ticketRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final TicketResponseMapper ticketResponseMapper;
    private final TicketValueParser ticketValueParser;
    private final EntityManager entityManager;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;
    private final CrmPermissionEvaluator permissionEvaluator;
    private final S3ImageRepository s3ImageRepository;
    private final ThumborFeignClient thumborFeignClient;

    @Value("${app.crm.system-tenant-id:00000000-0000-0000-0000-000000000000}")
    private UUID systemTenantId;

    @Value("${app.crm.ticket-attachments.folder:crmAttachments}")
    private String ticketAttachmentFolder;

    // -- Resource service methods --

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = resolveCurrentUserIdOrThrow();
        Specification<TicketEntity> specification = permissionEvaluator
                .filterReadTickets(userId)
                .and(buildSpecificationFromFilters(filters));
        try {
            return ticketRepository.findAll(specification, pageable)
                    .map(ticket -> toAuthorizedResponse(userId, ticket));
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
                .map(ticket -> toAuthorizedResponse(userId, ticket))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse findById(UUID id) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(id);
        ensureCanReadTicket(userId, entity);
        return toAuthorizedResponse(userId, entity);
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
        return toAuthorizedResponse(userId, saved);
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
        return toAuthorizedResponse(userId, saved);
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
        IssueType type = request.type() != null ? request.type() : IssueType.QUESTION;
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
        autoAssignCreatedTicketToMatchingTeam(saved, userId);
        saved = ticketRepository.save(saved);
        return toAuthorizedResponse(userId, saved);
    }

    public TicketResponse changeStatus(UUID ticketId, ChangeStatusRequest request) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);
        ensureCanUpdateTicket(userId, entity);
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }
        TicketStatus newStatus = request.status();
        changeStatusInternal(entity, newStatus);

        TicketEntity saved = ticketRepository.save(entity);
        return toAuthorizedResponse(userId, saved);
    }

    public TicketResponse changePriority(UUID ticketId, ChangePriorityRequest request) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);
        ensureCanUpdateTicket(userId, entity);
        TicketPriority oldPriority = entity.getPriority();
        TicketPriority newPriority = request.priority();

        if (oldPriority == newPriority) {
            return toAuthorizedResponse(userId, entity);
        }

        ensureTicketNotTerminal(entity, "Ticket priority cannot be changed after it is resolved, closed or cancelled");

        entity.setPriority(newPriority);
        entity.setUpdatedAt(LocalDateTime.now());

        addHistory(entity, TicketHistoryEntity.EventType.PRIORITY_CHANGED,
                String.format("Priority changed from %s to %s", oldPriority, newPriority));

        TicketEntity saved = ticketRepository.save(entity);
        return toAuthorizedResponse(userId, saved);
    }

    public TicketResponse assignTicket(UUID ticketId, AssignTicketRequest request) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);
        validateAssignable(entity);
        TeamEntity assignmentTeam = resolveAssignmentTeamOrThrow(request);
        AppUser assignmentAgent = resolveAssignmentAgentOrThrow(request, assignmentTeam);

        TicketAssignmentEntity assignment = entity.getCurrentAssignment();
        boolean hasExistingAssignment = assignment != null;
        boolean isReassignment = hasExistingAssignment && Boolean.TRUE.equals(assignment.getActive());
        if (isReassignment) {
            ensureCanUpdateTicketAssignment(userId, entity, assignment);
        } else {
            ensureCanCreateTicketAssignment(userId, entity);
        }

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
        return toAuthorizedResponse(userId, saved);
    }

    public TicketResponse unassignTicket(UUID ticketId) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity entity = findOrThrow(ticketId);

        if (entity.getCurrentAssignment() != null
                && Boolean.TRUE.equals(entity.getCurrentAssignment().getActive())) {
            TicketAssignmentEntity assignment = entity.getCurrentAssignment();
            ensureCanDeleteTicketAssignment(userId, entity, assignment);

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
        return toAuthorizedResponse(userId, saved);
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
        return toAuthorizedResponse(userId, saved);
    }

    public AttachmentResponse addAttachment(UUID ticketId, MultipartFile file) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity ticket = findOrThrow(ticketId);
        ensureCanCreateTicketAttachment(userId, ticket, null);
        validateCommentable(ticket);
        validateAttachmentFile(file);

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read attachment file", e);
        }

        String attachmentFolder = resolveAttachmentFolder();
        S3FileDTO uploadedFile;
        try {
            uploadedFile = s3ImageRepository.create(attachmentFolder, fileBytes);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }

        UUID tenantId = ticket.getTenantId();
        if (tenantId == null) {
            cleanupTicketAttachmentUpload(attachmentFolder, uploadedFile.getFileName());
            throw new IllegalStateException("Tenant not found");
        }

        try {
            TicketAttachmentEntity attachment = new TicketAttachmentEntity();
            attachment.setTicket(ticket);
            attachment.setComment(null);
            attachment.setFileName(resolveAttachmentFileName(file, uploadedFile.getFileName()));
            attachment.setFileSize(file.getSize());
            attachment.setContentType(resolveAttachmentContentType(file));
            attachment.setStorageKey(uploadedFile.getFileName());
            attachment.setUploadedBy(userId.hashCode());
            attachment.setUploadedAt(LocalDateTime.now());
            attachment.setTenantId(tenantId);

            ticket.getAttachments().add(attachment);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticketRepository.save(ticket);

            return toAttachmentResponse(attachment);
        } catch (RuntimeException e) {
            cleanupTicketAttachmentUpload(attachmentFolder, uploadedFile.getFileName());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save ticket attachment", e);
        }
    }

    @Transactional(readOnly = true)
    public TicketAttachmentContentResponse getAttachmentContent(UUID ticketId, UUID attachmentId) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity ticket = findOrThrow(ticketId);
        TicketAttachmentEntity attachment = findTicketAttachmentOrThrow(ticket, attachmentId);
        ensureCanReadTicketAttachment(userId, ticket, attachment.getComment(), attachment);

        ResponseEntity<byte[]> thumborResponse;
        try {
            thumborResponse = thumborFeignClient.getFile(resolveAttachmentFolder(), attachment.getStorageKey());
        } catch (FeignException.NotFound e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Attachment not found on thumbor: " + attachment.getStorageKey(),
                    e
            );
        } catch (FeignException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to fetch attachment from thumbor",
                    e
            );
        }

        if (!thumborResponse.getStatusCode().is2xxSuccessful() || thumborResponse.getBody() == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Attachment not found on thumbor: " + attachment.getStorageKey()
            );
        }

        MediaType contentType = thumborResponse.getHeaders().getContentType();
        if (contentType == null) {
            contentType = parseMediaTypeOrDefault(attachment.getContentType());
        }

        Resource resource = new ByteArrayResource(thumborResponse.getBody());
        return new TicketAttachmentContentResponse(resource, contentType);
    }

    @Transactional(readOnly = true)
    public Page<AssignmentTeamCandidateResponse> findAssignmentTeamCandidates(
            UUID ticketId,
            String searchQuery,
            Pageable pageable
    ) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity ticket = findOrThrow(ticketId);
        ensureCanChangeTicketAssignment(userId, ticket);

        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        Specification<TeamEntity> specification = (root, _, cb) -> cb.and(
                cb.equal(root.get("tenantId"), resolvedSystemTenantId),
                cb.isTrue(root.get("isActive"))
        );

        if (searchQuery != null && !searchQuery.isBlank()) {
            String normalizedSearch = searchQuery.trim().toLowerCase();
            UUID teamIdFilter = parseUuidOrNull(normalizedSearch);

            specification = specification.and((root, _, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + normalizedSearch + "%"),
                    cb.like(cb.lower(root.get("type").as(String.class)), "%" + normalizedSearch + "%"),
                    teamIdFilter != null ? cb.equal(root.get("id"), teamIdFilter) : cb.disjunction()
            ));
        }

        return teamRepository.findAll(specification, pageable)
                .map(team -> new AssignmentTeamCandidateResponse(
                        team.getId(),
                        team.getName(),
                        team.getType() != null ? team.getType().name() : null,
                        formatTeamLabel(team)
                ));
    }

    @Transactional(readOnly = true)
    public Page<AssignmentTeamMemberCandidateResponse> findAssignmentTeamMemberCandidates(
            UUID ticketId,
            UUID teamId,
            String searchQuery,
            Pageable pageable
    ) {
        UUID userId = resolveCurrentUserIdOrThrow();
        TicketEntity ticket = findOrThrow(ticketId);
        ensureCanChangeTicketAssignment(userId, ticket);

        TeamEntity team = findAssignableTeamOrThrow(teamId);
        List<TeamMemberEntity> members = team.getMembers().stream()
                .filter(Objects::nonNull)
                .filter(member -> member.getUser() != null && member.getUser().getId() != null)
                .filter(member -> member.getRole() != null && AGENT_TEAM_MEMBER_ROLES.contains(member.getRole()))
                .filter(member -> matchesAssignmentMemberSearch(member, searchQuery))
                .sorted(Comparator
                        .comparing((TeamMemberEntity member) -> resolveUserDisplayName(member.getUser()),
                                String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(member -> member.getUser().getId()))
                .toList();

        List<AssignmentTeamMemberCandidateResponse> responses = members.stream()
                .map(member -> {
                    AppUser user = member.getUser();
                    String displayName = resolveUserDisplayName(user);
                    return new AssignmentTeamMemberCandidateResponse(
                            user.getId(),
                            displayName,
                            user.getEmail(),
                            member.getRole().name(),
                            formatUserLabel(user, displayName)
                    );
                })
                .toList();

        return toPage(responses, pageable);
    }

    // -- Internal Helpers --

    private void changeStatusInternal(TicketEntity entity, TicketStatus newStatus) {
        TicketStatus oldStatus = entity.getStatus();
        validateStatusTransition(oldStatus, newStatus);

        if (oldStatus == newStatus) {
            return;
        }

        entity.setStatus(newStatus);
        entity.setUpdatedAt(LocalDateTime.now());

        if (newStatus == TicketStatus.RESOLVED) {
            entity.setResolvedAt(LocalDateTime.now());
            recordSlaResolution(entity);
        } else if (newStatus == TicketStatus.CLOSED) {
            entity.setClosedAt(LocalDateTime.now());
        }

        addHistory(entity, TicketHistoryEntity.EventType.STATUS_CHANGED,
                String.format("Status changed from %s to %s", oldStatus, newStatus));
    }

    private void validateStatusTransition(TicketStatus oldStatus, TicketStatus newStatus) {
        if (newStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }
        if (oldStatus == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ticket status is not set");
        }

        if (oldStatus == newStatus) {
            return;
        }

        if (isTerminalStatus(oldStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ticket status cannot be changed after it is resolved, closed or cancelled"
            );
        }

        if (!oldStatus.canTransitionTo(newStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    String.format("Cannot transition ticket status from %s to %s", oldStatus, newStatus)
            );
        }
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

    private void autoAssignCreatedTicketToMatchingTeam(TicketEntity ticket, UUID assignedByUserId) {
        IssueType ticketType = ticket.getType();
        if (ticketType == null) {
            throw new IllegalStateException("Ticket type cannot be null for auto-assignment");
        }

        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        List<TeamEntity> candidateTeams = teamRepository.findAllByTenantIdAndType(resolvedSystemTenantId, ticketType);
        if (candidateTeams.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No team found for ticket type: " + ticketType.name()
            );
        }
        if (candidateTeams.size() > 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Multiple teams configured for ticket type: " + ticketType.name()
            );
        }
        TeamEntity assignmentTeam = candidateTeams.get(0);

        if (!Boolean.TRUE.equals(assignmentTeam.getIsActive())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Team for ticket type is inactive: " + ticketType.name());
        }

        TicketAssignmentEntity assignment = ticket.getCurrentAssignment();
        boolean hasExistingAssignment = assignment != null;
        AppUser leastLoadedAgent = resolveLeastLoadedAssignableAgent(assignmentTeam);
        if (!hasExistingAssignment) {
            assignment = new TicketAssignmentEntity();
        }

        assignment.setTicket(ticket);
        assignment.setTeam(assignmentTeam);
        assignment.setAgentParty(leastLoadedAgent);
        assignment.setAssignedByParty(toAppUserReference(assignedByUserId));
        assignment.setActive(true);
        assignment.setReason(leastLoadedAgent != null
                ? "Auto-assigned by ticket type and lowest active workload"
                : "Auto-assigned by ticket type");
        assignment.setAssignedAt(LocalDateTime.now());
        assignment.setUnassignedAt(null);
        assignment.setTenantId(ticket.getTenantId());

        if (!hasExistingAssignment) {
            entityManager.persist(assignment);
        }
        ticket.setCurrentAssignment(assignment);

        addHistory(ticket, TicketHistoryEntity.EventType.ASSIGNED,
                leastLoadedAgent != null
                        ? String.format("Ticket auto-assigned to team %s and agent %s",
                        assignmentTeam.getId(), leastLoadedAgent.getId())
                        : String.format("Ticket auto-assigned to team: %s", assignmentTeam.getId()),
                REFERENCE_TYPE_TEAM,
                assignmentTeam.getId());
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
        if (!Boolean.TRUE.equals(team.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team must be active for assignment");
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

    private AppUser resolveLeastLoadedAssignableAgent(TeamEntity team) {
        if (team == null || team.getId() == null) {
            return null;
        }

        return team.getMembers().stream()
                .filter(Objects::nonNull)
                .filter(member -> member.getUser() != null && member.getUser().getId() != null)
                .filter(member -> member.getRole() != null && AGENT_TEAM_MEMBER_ROLES.contains(member.getRole()))
                .min(Comparator
                        .comparingLong((TeamMemberEntity member) ->
                                ticketRepository.countByCurrentAssignmentTeamIdAndCurrentAssignmentAgentPartyIdAndCurrentAssignmentActiveTrue(
                                        team.getId(),
                                        member.getUser().getId()
                                ))
                        .thenComparing(TeamMemberEntity::getJoinedAt,
                                Comparator.nullsLast(Comparator.naturalOrder()))
                        .thenComparing(member -> member.getUser().getId()))
                .map(TeamMemberEntity::getUser)
                .orElse(null);
    }

    private void validateAssignable(TicketEntity entity) {
        if (isTerminalStatus(entity.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot assign a resolved, closed or cancelled ticket"
            );
        }
    }

    private void validateCommentable(TicketEntity entity) {
        if (isTerminalStatus(entity.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot make a comment on a resolved, closed or cancelled ticket"
            );
        }
    }

    private void validateAttachmentFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attachment file is required");
        }
    }

    private String resolveAttachmentFileName(MultipartFile file, String fallbackFileName) {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            return fallbackFileName;
        }
        return originalFileName.trim();
    }

    private String resolveAttachmentContentType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            return DEFAULT_CONTENT_TYPE;
        }
        return contentType.trim();
    }

    private MediaType parseMediaTypeOrDefault(String rawContentType) {
        if (rawContentType == null || rawContentType.isBlank()) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }

        try {
            return MediaType.parseMediaType(rawContentType);
        } catch (IllegalArgumentException ignored) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    private boolean matchesAssignmentMemberSearch(TeamMemberEntity member, String searchQuery) {
        if (searchQuery == null || searchQuery.isBlank()) {
            return true;
        }

        AppUser user = member.getUser();
        String normalized = searchQuery.trim().toLowerCase();
        String displayName = resolveUserDisplayName(user).toLowerCase();
        String username = user != null && user.getUsername() != null ? user.getUsername().toLowerCase() : "";
        String email = user != null && user.getEmail() != null ? user.getEmail().toLowerCase() : "";
        String userId = user != null && user.getId() != null ? user.getId().toString().toLowerCase() : "";
        String role = member.getRole() != null ? member.getRole().name().toLowerCase() : "";

        return displayName.contains(normalized)
                || username.contains(normalized)
                || email.contains(normalized)
                || userId.contains(normalized)
                || role.contains(normalized);
    }

    private String resolveUserDisplayName(AppUser user) {
        if (user == null) {
            return "Unknown";
        }

        if (user instanceof org.zerp.common.entity.employee.Employee employee) {
            String fullName = ((employee.getFirstName() != null ? employee.getFirstName().trim() : "") + " "
                    + (employee.getLastName() != null ? employee.getLastName().trim() : "")).trim();
            if (!fullName.isBlank()) {
                return fullName;
            }
        }

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            return user.getUsername().trim();
        }
        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            return user.getEmail().trim();
        }
        return user.getId() != null ? user.getId().toString() : "Unknown";
    }

    private String formatUserLabel(AppUser user, String displayName) {
        String base = displayName != null && !displayName.isBlank()
                ? displayName
                : resolveUserDisplayName(user);
        return user != null && user.getId() != null
                ? base + " (" + user.getId() + ")"
                : base;
    }

    private String formatTeamLabel(TeamEntity team) {
        if (team == null) {
            return "Unknown";
        }

        String name = team.getName() != null && !team.getName().isBlank() ? team.getName().trim() : "Unnamed Team";
        String type = team.getType() != null ? team.getType().name() : "UNKNOWN";
        return team.getId() != null
                ? String.format("%s (%s) - %s", name, type, team.getId())
                : String.format("%s (%s)", name, type);
    }

    private UUID parseUuidOrNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return UUID.fromString(value.trim());
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private TeamEntity findAssignableTeamOrThrow(UUID teamId) {
        if (teamId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "teamId is required");
        }

        TeamEntity team = entityManager.find(TeamEntity.class, teamId);
        if (team == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId);
        }

        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        if (!resolvedSystemTenantId.equals(team.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId);
        }
        if (!Boolean.TRUE.equals(team.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team must be active for assignment");
        }
        return team;
    }

    private <T> Page<T> toPage(List<T> items, Pageable pageable) {
        if (items.isEmpty()) {
            return Page.empty(pageable);
        }

        int offset = Math.toIntExact(pageable.getOffset());
        if (offset >= items.size()) {
            return new PageImpl<>(List.of(), pageable, items.size());
        }

        int end = Math.min(offset + pageable.getPageSize(), items.size());
        return new PageImpl<>(items.subList(offset, end), pageable, items.size());
    }

    private TicketAttachmentEntity findTicketAttachmentOrThrow(TicketEntity ticket, UUID attachmentId) {
        if (attachmentId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "attachmentId is required");
        }

        return ticket.getAttachments().stream()
                .filter(attachment -> attachmentId.equals(attachment.getId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Attachment not found: " + attachmentId
                ));
    }

    private AttachmentResponse toAttachmentResponse(TicketAttachmentEntity attachment) {
        return new AttachmentResponse(
                attachment.getId(),
                attachment.getFileName(),
                attachment.getFileSize(),
                attachment.getContentType(),
                attachment.getStorageKey(),
                attachment.getUploadedBy(),
                attachment.getUploadedAt()
        );
    }

    private String resolveAttachmentFolder() {
        if (ticketAttachmentFolder == null || ticketAttachmentFolder.isBlank()) {
            return "crmAttachments";
        }

        String folder = ticketAttachmentFolder.trim();
        if (folder.endsWith("/")) {
            return folder.substring(0, folder.length() - 1);
        }
        return folder;
    }

    private void cleanupTicketAttachmentUpload(String folder, String storageKey) {
        try {
            s3ImageRepository.delete(folder, storageKey);
        } catch (RuntimeException cleanupEx) {
            log.error("failed to rollback uploaded ticket attachment with storage key {}", storageKey, cleanupEx);
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
        ensureTicketNotTerminal(entity, "Ticket cannot be edited after it is resolved, closed or cancelled");
    }

    private void ensureTicketNotTerminal(TicketEntity entity, String message) {
        if (entity != null && isTerminalStatus(entity.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, message);
        }
    }

    private boolean isTerminalStatus(TicketStatus status) {
        return status == TicketStatus.RESOLVED || status == TicketStatus.CLOSED || status == TicketStatus.CANCELLED;
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
        addHistory(entity, eventType, payload, REFERENCE_TYPE_TICKET, entity.getId());
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

    private TicketResponse toAuthorizedResponse(UUID userId, TicketEntity ticket) {
        TicketResponse response = ticketResponseMapper.toResponse(ticket);

        CrmPermissionEvaluator.TicketParent ticketParent = toTicketParent(ticket);
        List<CommentResponse> rawComments = response.comments() != null ? response.comments() : List.of();
        List<AttachmentResponse> rawAttachments = response.attachments() != null ? response.attachments() : List.of();
        Set<WatcherResponse> rawWatchers = response.watchers() != null ? response.watchers() : Set.of();

        boolean hasComments = !rawComments.isEmpty();
        boolean hasAttachments = !rawAttachments.isEmpty() || rawComments.stream()
                .anyMatch(comment -> comment.attachments() != null && !comment.attachments().isEmpty());
        boolean hasAssignment = response.currentAssignment() != null;
        boolean hasSlaTracking = response.slaTracking() != null;
        boolean hasWatchers = !rawWatchers.isEmpty();

        boolean canReadComments = !hasComments || permissionEvaluator.canReadTicketComment(userId, ticketParent);
        boolean canReadAttachments = !hasAttachments || permissionEvaluator
                .canReadTicketAttachment(userId, toTicketAttachmentParent(ticket));
        boolean canReadAssignment = !hasAssignment || permissionEvaluator.canReadTicketAssignment(userId, ticketParent);
        boolean canReadSlaTracking = !hasSlaTracking || permissionEvaluator.canReadTicketSlaTracking(userId, ticketParent);
        boolean canReadWatchers = !hasWatchers || permissionEvaluator.canReadTicketWatcher(userId, ticketParent);

        if (canReadComments && canReadAttachments && canReadAssignment && canReadSlaTracking && canReadWatchers) {
            return response;
        }

        List<AttachmentResponse> attachments = canReadAttachments ? rawAttachments : List.of();
        List<CommentResponse> comments = canReadComments ? rawComments : List.of();
        if (canReadComments && !canReadAttachments && comments != null && !comments.isEmpty()) {
            comments = comments.stream()
                    .map(comment -> new CommentResponse(
                            comment.id(),
                            comment.authorId(),
                            comment.authorName(),
                            comment.authorType(),
                            comment.content(),
                            comment.isInternal(),
                            comment.createdAt(),
                            List.of()))
                    .collect(Collectors.toList());
        }

        return new TicketResponse(
                response.id(),
                response.title(),
                response.description(),
                response.status(),
                response.priority(),
                response.type(),
                response.tenantId(),
                response.reporterId(),
                response.createdAt(),
                response.updatedAt(),
                response.resolvedAt(),
                response.closedAt(),
                response.tags(),
                response.customAttributes(),
                canReadWatchers ? response.watchers() : Set.of(),
                attachments,
                canReadAssignment ? response.currentAssignment() : null,
                comments,
                canReadSlaTracking ? response.slaTracking() : null
        );
    }

    private CrmPermissionEvaluator.TicketTarget toTicketTarget(TicketEntity ticket) {
        return new CrmPermissionEvaluator.TicketTarget(
                ticket.getId(),
                ticket.getTenantId(),
                getActiveAssignedTeamId(ticket),
                getActiveAssignedAgentId(ticket)
        );
    }

    private CrmPermissionEvaluator.TicketParent toTicketParent(TicketEntity ticket) {
        return new CrmPermissionEvaluator.TicketParent(
                ticket.getId(),
                ticket.getTenantId(),
                getActiveAssignedTeamId(ticket),
                getActiveAssignedAgentId(ticket)
        );
    }

    private CrmPermissionEvaluator.TicketAttachmentParent toTicketAttachmentParent(TicketEntity ticket) {
        return new CrmPermissionEvaluator.TicketAttachmentParent(
                null,
                ticket.getId(),
                ticket.getTenantId(),
                getActiveAssignedTeamId(ticket),
                getActiveAssignedAgentId(ticket)
        );
    }

    private CrmPermissionEvaluator.TicketChildTarget toTicketCommentTarget(
            TicketEntity ticket,
            TicketCommentEntity comment
    ) {
        return new CrmPermissionEvaluator.TicketChildTarget(
                comment != null ? comment.getId() : null,
                ticket.getId(),
                ticket.getTenantId(),
                getActiveAssignedTeamId(ticket),
                getActiveAssignedAgentId(ticket)
        );
    }

    private CrmPermissionEvaluator.TicketChildTarget toTicketAssignmentTarget(
            TicketEntity ticket,
            TicketAssignmentEntity assignment
    ) {
        return new CrmPermissionEvaluator.TicketChildTarget(
                assignment != null ? assignment.getId() : null,
                ticket.getId(),
                ticket.getTenantId(),
                getActiveAssignedTeamId(ticket),
                getActiveAssignedAgentId(ticket)
        );
    }

    private CrmPermissionEvaluator.TicketAttachmentTarget toTicketAttachmentTarget(
            TicketEntity ticket,
            TicketCommentEntity comment,
            TicketAttachmentEntity attachment
    ) {
        return new CrmPermissionEvaluator.TicketAttachmentTarget(
                attachment != null ? attachment.getId() : null,
                comment != null ? comment.getId() : null,
                ticket.getId(),
                ticket.getTenantId(),
                getActiveAssignedTeamId(ticket),
                getActiveAssignedAgentId(ticket)
        );
    }

    private CrmPermissionEvaluator.TicketChildTarget toTicketWatcherTarget(
            TicketEntity ticket,
            TicketWatcherEntity watcher
    ) {
        return new CrmPermissionEvaluator.TicketChildTarget(
                watcher != null ? watcher.getId() : null,
                ticket.getId(),
                ticket.getTenantId(),
                getActiveAssignedTeamId(ticket),
                getActiveAssignedAgentId(ticket)
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

    private void ensureCanReadTicketComment(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canReadTicketComment(userId, toTicketParent(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Ticket comment");
        }
    }

    private void ensureCanCreateTicketComment(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canCreateTicketComment(userId, toTicketParent(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Ticket comment");
        }
    }

    private void ensureCanUpdateTicketComment(UUID userId, TicketEntity ticket, TicketCommentEntity comment) {
        if (!permissionEvaluator.canUpdateTicketComment(userId, toTicketCommentTarget(ticket, comment))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Ticket comment");
        }
    }

    private void ensureCanDeleteTicketComment(UUID userId, TicketEntity ticket, TicketCommentEntity comment) {
        if (!permissionEvaluator.canDeleteTicketComment(userId, toTicketCommentTarget(ticket, comment))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Ticket comment");
        }
    }

    private void ensureCanReadTicketAssignment(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canReadTicketAssignment(userId, toTicketParent(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Ticket assignment");
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

    private void ensureCanDeleteTicketAssignment(UUID userId, TicketEntity ticket, TicketAssignmentEntity assignment) {
        if (!permissionEvaluator.canDeleteTicketAssignment(userId, toTicketAssignmentTarget(ticket, assignment))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Ticket assignment");
        }
    }

    private void ensureCanChangeTicketAssignment(UUID userId, TicketEntity ticket) {
        TicketAssignmentEntity currentAssignment = ticket.getCurrentAssignment();
        if (currentAssignment != null && Boolean.TRUE.equals(currentAssignment.getActive())) {
            ensureCanUpdateTicketAssignment(userId, ticket, currentAssignment);
            return;
        }
        ensureCanCreateTicketAssignment(userId, ticket);
    }

    private void ensureCanReadTicketAttachment(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canReadTicketAttachment(userId, toTicketAttachmentParent(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Ticket attachment");
        }
    }

    private void ensureCanReadTicketAttachment(
            UUID userId,
            TicketEntity ticket,
            TicketCommentEntity comment,
            TicketAttachmentEntity attachment
    ) {
        if (!permissionEvaluator.canReadTicketAttachment(userId, toTicketAttachmentTarget(ticket, comment, attachment))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Ticket attachment");
        }
    }

    private void ensureCanCreateTicketAttachment(UUID userId, TicketEntity ticket, TicketCommentEntity comment) {
        if (!permissionEvaluator.canCreateTicketAttachment(userId, new CrmPermissionEvaluator.TicketAttachmentParent(
                comment != null ? comment.getId() : null,
                ticket.getId(),
                ticket.getTenantId(),
                getActiveAssignedTeamId(ticket),
                getActiveAssignedAgentId(ticket)
        ))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Ticket attachment");
        }
    }

    private UUID getActiveAssignedTeamId(TicketEntity ticket) {
        TicketAssignmentEntity assignment = ticket.getCurrentAssignment();
        if (assignment == null || !Boolean.TRUE.equals(assignment.getActive()) || assignment.getTeam() == null) {
            return null;
        }
        return assignment.getTeam().getId();
    }

    private UUID getActiveAssignedAgentId(TicketEntity ticket) {
        TicketAssignmentEntity assignment = ticket.getCurrentAssignment();
        if (assignment == null || !Boolean.TRUE.equals(assignment.getActive()) || assignment.getAgentParty() == null) {
            return null;
        }
        return assignment.getAgentParty().getId();
    }

    private void ensureCanUpdateTicketAttachment(
            UUID userId,
            TicketEntity ticket,
            TicketCommentEntity comment,
            TicketAttachmentEntity attachment
    ) {
        if (!permissionEvaluator.canUpdateTicketAttachment(userId, toTicketAttachmentTarget(ticket, comment, attachment))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Ticket attachment");
        }
    }

    private void ensureCanDeleteTicketAttachment(
            UUID userId,
            TicketEntity ticket,
            TicketCommentEntity comment,
            TicketAttachmentEntity attachment
    ) {
        if (!permissionEvaluator.canDeleteTicketAttachment(userId, toTicketAttachmentTarget(ticket, comment, attachment))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Ticket attachment");
        }
    }

    private void ensureCanReadTicketWatcher(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canReadTicketWatcher(userId, toTicketParent(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Ticket watcher");
        }
    }

    private void ensureCanCreateTicketWatcher(UUID userId, TicketEntity ticket) {
        if (!permissionEvaluator.canCreateTicketWatcher(userId, toTicketParent(ticket))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Ticket watcher");
        }
    }

    private void ensureCanUpdateTicketWatcher(UUID userId, TicketEntity ticket, TicketWatcherEntity watcher) {
        if (!permissionEvaluator.canUpdateTicketWatcher(userId, toTicketWatcherTarget(ticket, watcher))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Ticket watcher");
        }
    }

    private void ensureCanDeleteTicketWatcher(UUID userId, TicketEntity ticket, TicketWatcherEntity watcher) {
        if (!permissionEvaluator.canDeleteTicketWatcher(userId, toTicketWatcherTarget(ticket, watcher))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Ticket watcher");
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
