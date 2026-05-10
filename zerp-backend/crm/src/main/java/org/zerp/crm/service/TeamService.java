package org.zerp.crm.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.crm.IssueType;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TeamMemberEntity;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterErrorUtils;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.service.PermittableService;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.crm.permission.CrmPermissionEvaluator;
import org.zerp.crm.dto.team.*;
import org.zerp.crm.repository.AppUserRepository;
import org.zerp.crm.repository.TeamRepository;

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
public class TeamService implements IResourceService<TeamResponse, TeamResponse,
        CreateTeamRequest, UpdateTeamRequest, UUID> {
    private final TeamRepository teamRepository;
    private final AppUserRepository appUserRepository;
    private final EntityManager entityManager;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;
    private final CrmPermissionEvaluator permissionEvaluator;
    private final PermittableService permittableService;

    @Value("${app.crm.system-tenant-id:00000000-0000-0000-0000-000000000000}")
    private UUID systemTenantId;

    @Override
    @Transactional(readOnly = true)
    public Page<TeamResponse> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = resolveCurrentUserId();
        Specification<TeamEntity> specification = buildSpecificationFromFilters(filters);
        specification = systemTenantOwnershipSpec()
                .and(permissionEvaluator.filterReadTeams(userId))
                .and(specification);
        try {
            return teamRepository.findAll(specification, pageable)
                    .map(team -> toResponse(team, userId));
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
    public List<TeamResponse> findAllById(List<UUID> ids) {
        UUID userId = resolveCurrentUserId();
        return teamRepository.findAllById(ids).stream()
                .filter(this::isOwnedBySystemTenant)
                .filter(team -> permissionEvaluator.canReadTeam(userId, toTeamTarget(team)))
                .map(team -> toResponse(team, userId))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse findById(UUID id) {
        UUID userId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(id);
        ensureCanReadTeam(userId, entity);
        return toResponse(entity, userId);
    }

    @Override
    public TeamResponse create(CreateTeamRequest data) {
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team payload is required");
        }
        UUID userId = resolveCurrentUserId();
        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        ensureCanCreateTeam(userId, resolvedSystemTenantId);
        ensureSystemTenantExists(resolvedSystemTenantId);
        IssueType teamType = requireTeamType(data.type());
        ensureUniqueTeamType(resolvedSystemTenantId, teamType, null);

        TeamEntity entity = new TeamEntity();
        entity.setName(validateName(data.name()));
        entity.setDescription(data.description());
        entity.setIsActive(true);
        entity.setType(teamType);
        entity.setTenantId(resolvedSystemTenantId);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved, userId);
    }

    @Override
    public TeamResponse patch(UUID id, Map<String, Object> data) {
        UUID userId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(id);
        ensureCanUpdateTeam(userId, entity);

        if (data.containsKey("name")) {
            entity.setName(validateName(String.valueOf(data.get("name"))));
        }
        if (data.containsKey("description")) {
            Object description = data.get("description");
            entity.setDescription(description == null ? null : String.valueOf(description));
        }
        if (data.containsKey("isActive")) {
            entity.setIsActive(parseBoolean(data.get("isActive"), "isActive"));
        }
        if (data.containsKey("type")) {
            IssueType type = parseTeamType(data.get("type"), "type");
            if (entity.getType() != type) {
                ensureUniqueTeamType(entity.getTenantId(), type, entity.getId());
                entity.setType(type);
            }
        }

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved, userId);
    }

    @Override
    public TeamResponse update(UUID id, UpdateTeamRequest data) {
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team payload is required");
        }
        UUID userId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(id);
        ensureCanUpdateTeam(userId, entity);
        entity.setName(validateName(data.name()));
        entity.setDescription(data.description());
        if (data.type() != null && entity.getType() != data.type()) {
            ensureUniqueTeamType(entity.getTenantId(), data.type(), entity.getId());
            entity.setType(data.type());
        }

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved, userId);
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
        UUID userId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(id);
        ensureCanDeleteTeam(userId, entity);
        teamRepository.delete(entity);
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

    // -- others --

    public TeamResponse deactivateTeam(UUID teamId) {
        UUID userId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(teamId);
        ensureCanUpdateTeam(userId, entity);
        if (!Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Team is already inactive");
        }
        entity.setIsActive(false);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved, userId);
    }

    public TeamResponse activateTeam(UUID teamId) {
        UUID userId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(teamId);
        ensureCanUpdateTeam(userId, entity);
        if (Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Team is already active");
        }
        entity.setIsActive(true);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved, userId);
    }

    public TeamResponse addMember(UUID teamId, AddMemberRequest request) {
        UUID userId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(teamId);
        ensureCanCreateTeamMember(userId, entity);

        if (!Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Cannot add member to an inactive team");
        }
        if (request.userId() == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }
        if (request.role() == null) {
            throw new IllegalArgumentException("role cannot be null");
        }
        AppUser appUser = findAppUserOrThrow(request.userId());
        ensureMemberTenantMatchesTeamTenant(appUser, entity);

        boolean alreadyMember = entity.getMembers().stream()
                .anyMatch(m -> m.getUser() != null && request.userId().equals(m.getUser().getId()));
        if (alreadyMember) {
            throw new IllegalArgumentException(
                    String.format("User %s is already a member of this team", request.userId()));
        }

        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(entity);
        member.setUser(appUser);
        member.setRole(request.role());
        member.setJoinedAt(LocalDateTime.now());
        entity.getMembers().add(member);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved, userId);
    }

    public TeamResponse removeMember(UUID teamId, UUID userId) {
        UUID actorUserId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(teamId);
        if (userId == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }

        TeamMemberEntity member = findMemberOrThrow(entity, userId);
        ensureCanDeleteTeamMember(actorUserId, entity, member);
        entity.getMembers().remove(member);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved, actorUserId);
    }

    public TeamResponse changeMemberRole(UUID teamId, UUID userId, ChangeMemberRoleRequest request) {
        UUID actorUserId = resolveCurrentUserId();
        TeamEntity entity = findSystemOwnedTeamOrThrow(teamId);
        if (userId == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }
        if (request.role() == null) {
            throw new IllegalArgumentException("role cannot be null");
        }

        TeamMemberEntity member = findMemberOrThrow(entity, userId);
        ensureCanUpdateTeamMember(actorUserId, entity, member);

        member.setRole(request.role());

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved, actorUserId);
    }

    @Transactional(readOnly = true)
    public Page<TeamMemberCandidateResponse> findMemberCandidates(
            UUID teamId,
            String usernameSearch,
            Pageable pageable
    ) {
        UUID actorUserId = resolveCurrentUserId();
        TeamEntity team = findSystemOwnedTeamOrThrow(teamId);
        ensureCanCreateTeamMember(actorUserId, team);

        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        Set<UUID> permittedUserIds = permittableService.getAllPermitted(
                actorUserId, PermissionTargetType.USER, PermissionAction.READ_USER);
        Set<UUID> permittedTenantIds = permittableService.getAllPermitted(
                actorUserId, PermissionTargetType.TENANT, PermissionAction.READ_USER);
        boolean hasRootReadUser = permittableService.hasRootPermission(actorUserId, PermissionAction.READ_USER);

        boolean hasTenantScopeReadUser = hasRootReadUser || permittedTenantIds.contains(resolvedSystemTenantId);

        if (!hasTenantScopeReadUser && permittedUserIds.isEmpty()) {
            return Page.empty(pageable);
        }

        Specification<AppUser> specification = (root, query, cb) ->
                cb.equal(root.get("tenantId"), resolvedSystemTenantId);

        if (!hasTenantScopeReadUser) {
            specification = specification.and((root, query, cb) -> root.get("id").in(permittedUserIds));
        }

        if (usernameSearch != null && !usernameSearch.isBlank()) {
            String normalizedSearch = usernameSearch.trim().toLowerCase();
            specification = specification.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("username")), "%" + normalizedSearch + "%"));
        }

        List<UUID> existingMemberUserIds = team.getMembers().stream()
                .map(TeamMemberEntity::getUser)
                .filter(user -> user != null && user.getId() != null)
                .map(AppUser::getId)
                .toList();
        if (!existingMemberUserIds.isEmpty()) {
            specification = specification.and((root, query, cb) -> cb.not(root.get("id").in(existingMemberUserIds)));
        }

        return appUserRepository.findAll(specification, pageable)
                .map(user -> new TeamMemberCandidateResponse(user.getId(), user.getUsername(), user.getEmail()));
    }

    // ─── Helpers ───

    private TeamEntity findSystemOwnedTeamOrThrow(UUID teamId) {
        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId));
        if (!isOwnedBySystemTenant(team)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId);
        }
        return team;
    }

    private TeamMemberEntity findMemberOrThrow(TeamEntity team, UUID userId) {
        return team.getMembers().stream()
                .filter(member -> member.getUser() != null && userId.equals(member.getUser().getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("User %s is not a member of this team", userId)));
    }

    private String validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be empty");
        }
        if (name.length() > 100) {
            throw new IllegalArgumentException("Team name is too long (max 100 characters)");
        }
        return name.trim();
    }

    private TeamResponse toResponse(TeamEntity entity, UUID userId) {
        List<TeamMemberResponse> memberResponses = entity.getMembers().stream()
                .filter(member -> permissionEvaluator.canReadTeamMember(userId, toTeamMemberTarget(entity, member)))
                .map(m -> new TeamMemberResponse(
                        m.getId(),
                        m.getUser() != null ? m.getUser().getId() : null,
                        m.getRole().name(),
                        m.getJoinedAt()))
                .collect(Collectors.toList());

        return new TeamResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getType() != null ? entity.getType().name() : null,
                Boolean.TRUE.equals(entity.getIsActive()),
                memberResponses);
    }

    private AppUser findAppUserOrThrow(UUID userId) {
        AppUser user = entityManager.find(AppUser.class, userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + userId);
        }
        return user;
    }

    private void ensureMemberTenantMatchesTeamTenant(AppUser user, TeamEntity team) {
        UUID userTenantId = user.getTenantId();
        UUID teamTenantId = team.getTenantId();
        if (userTenantId == null || !userTenantId.equals(teamTenantId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "AppUser tenant must match Team tenant");
        }
    }

    private Specification<TeamEntity> buildSpecificationFromFilters(Map<String, String> filters) {
        log.debug("Building specification for Team with filters: {}", filters);
        Specification<TeamEntity> spec = filterRefiner.refinedOrBadRequest(filters, TeamEntity.class);
        log.debug("Generated specification for Team with filters {}: {}", filters, spec);
        return spec;
    }

    private Specification<TeamEntity> systemTenantOwnershipSpec() {
        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        return (root, query, cb) -> cb.equal(root.get("tenantId"), resolvedSystemTenantId);
    }

    private Boolean parseBoolean(Object rawValue, String fieldName) {
        if (rawValue instanceof Boolean boolValue) {
            return boolValue;
        }

        if (rawValue != null) {
            String text = String.valueOf(rawValue).trim();
            if ("true".equalsIgnoreCase(text) || "false".equalsIgnoreCase(text)) {
                return Boolean.parseBoolean(text);
            }
        }

        throw new IllegalArgumentException("Invalid boolean value for " + fieldName + ": " + rawValue);
    }

    private IssueType parseTeamType(Object rawValue, String fieldName) {
        try {
            return IssueType.fromValue(rawValue);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid value for " + fieldName + ": " + rawValue, ex);
        }
    }

    private IssueType requireTeamType(IssueType type) {
        if (type == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type is required");
        }
        return type;
    }

    private void ensureUniqueTeamType(UUID tenantId, IssueType type, UUID teamIdToExclude) {
        boolean alreadyExists = teamIdToExclude == null
                ? teamRepository.existsByTenantIdAndType(tenantId, type)
                : teamRepository.existsByTenantIdAndTypeAndIdNot(tenantId, type, teamIdToExclude);
        if (alreadyExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A team already exists for type: " + type.name()
            );
        }
    }

    private UUID resolveCurrentUserId() {
        return currentUserIdResolver.resolve();
    }

    private UUID resolveSystemTenantIdOrThrow() {
        if (systemTenantId == null) {
            throw new IllegalStateException("System tenant is not configured");
        }
        return systemTenantId;
    }

    private void ensureSystemTenantExists(UUID tenantId) {
        if (entityManager.find(Tenant.class, tenantId) == null) {
            throw new IllegalStateException("System tenant not found: " + tenantId);
        }
    }

    private boolean isOwnedBySystemTenant(TeamEntity team) {
        UUID resolvedSystemTenantId = resolveSystemTenantIdOrThrow();
        return resolvedSystemTenantId.equals(team.getTenantId());
    }

    private CrmPermissionEvaluator.TeamTarget toTeamTarget(TeamEntity team) {
        return new CrmPermissionEvaluator.TeamTarget(team.getId(), team.getTenantId());
    }

    private CrmPermissionEvaluator.TeamParent toTeamParent(TeamEntity team) {
        return new CrmPermissionEvaluator.TeamParent(team.getId(), team.getTenantId());
    }

    private CrmPermissionEvaluator.TeamMemberTarget toTeamMemberTarget(TeamEntity team, TeamMemberEntity member) {
        return new CrmPermissionEvaluator.TeamMemberTarget(member.getId(), team.getId(), team.getTenantId());
    }

    private void ensureCanReadTeam(UUID userId, TeamEntity team) {
        if (!permissionEvaluator.canReadTeam(userId, toTeamTarget(team))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Team");
        }
    }

    private void ensureCanCreateTeam(UUID userId, UUID tenantId) {
        if (!permissionEvaluator.canCreateTeam(userId, new CrmPermissionEvaluator.TenantParent(tenantId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Team");
        }
    }

    private void ensureCanUpdateTeam(UUID userId, TeamEntity team) {
        if (!permissionEvaluator.canUpdateTeam(userId, toTeamTarget(team))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Team");
        }
    }

    private void ensureCanDeleteTeam(UUID userId, TeamEntity team) {
        if (!permissionEvaluator.canDeleteTeam(userId, toTeamTarget(team))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Team");
        }
    }

    private void ensureCanCreateTeamMember(UUID userId, TeamEntity team) {
        if (!permissionEvaluator.canCreateTeamMember(userId, toTeamParent(team))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Team member");
        }
    }

    private void ensureCanUpdateTeamMember(UUID userId, TeamEntity team, TeamMemberEntity member) {
        if (!permissionEvaluator.canUpdateTeamMember(userId, toTeamMemberTarget(team, member))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Team member");
        }
    }

    private void ensureCanDeleteTeamMember(UUID userId, TeamEntity team, TeamMemberEntity member) {
        if (!permissionEvaluator.canDeleteTeamMember(userId, toTeamMemberTarget(team, member))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Team member");
        }
    }
}
