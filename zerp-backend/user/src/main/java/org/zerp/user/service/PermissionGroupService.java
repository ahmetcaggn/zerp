package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionGroup;
import org.zerp.common.permission.entity.PermissionGroupAssignment;
import org.zerp.common.permission.entity.PermissionGroupAssignmentPermission;
import org.zerp.common.permission.entity.PermissionGroupScopeType;
import org.zerp.common.permission.entity.PermissionGroupSource;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PredefinedPermissionGroupCode;
import org.zerp.common.permission.repository.PermissionGroupAssignmentPermissionRepository;
import org.zerp.common.permission.repository.PermissionGroupAssignmentRepository;
import org.zerp.common.permission.repository.PermissionGroupRepository;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.common.entity.user.AppUser;
import org.zerp.user.dto.permissiongroup.PermissionGroupAssignRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupAssignResponseDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupAssignmentResponseDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupAssignmentRevokeResponseDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupCreateRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupPatchRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupResponseDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupUpdateRequestDTO;
import org.zerp.user.permission.PermissionActionTargetPolicy;
import org.zerp.user.permission.PermissionPermissionEvaluator;
import org.zerp.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class PermissionGroupService {
    private final PermissionGroupRepository permissionGroupRepository;
    private final PermissionGroupAssignmentRepository permissionGroupAssignmentRepository;
    private final PermissionGroupAssignmentPermissionRepository permissionGroupAssignmentPermissionRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PermissionPermissionEvaluator permissionEvaluator;
    private final PermissionActionTargetPolicy actionTargetPolicy;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final PermissionGroupSeedService permissionGroupSeedService;

    @Transactional(readOnly = true)
    public List<PermissionGroupResponseDTO> getPredefinedGroups() {
        ensureCanManageGroups();
        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        permissionGroupSeedService.ensurePredefinedGroupsForTenant(tenantId);

        return permissionGroupRepository
                .findAllByTenantIdAndSourceOrderByNameAsc(tenantId, PermissionGroupSource.PREDEFINED)
                .stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(PermissionGroupResponseDTO::getName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    @Transactional(readOnly = true)
    public PermissionGroupResponseDTO getPredefinedGroup(PredefinedPermissionGroupCode code) {
        ensureCanManageGroups();
        if (code == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Predefined permission group not found");
        }
        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        permissionGroupSeedService.ensurePredefinedGroupsForTenant(tenantId);

        PermissionGroup group = permissionGroupRepository
                .findByTenantIdAndSourceAndCode(tenantId, PermissionGroupSource.PREDEFINED, code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Predefined permission group not found"));

        return toResponse(group);
    }

    @Transactional(readOnly = true)
    public List<PermissionGroupResponseDTO> getCustomGroups() {
        ensureCanManageGroups();
        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        return permissionGroupRepository.findCustomByTenantIdOrderByNameAsc(tenantId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PermissionGroupResponseDTO getCustomGroup(UUID id) {
        ensureCanManageGroups();
        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        PermissionGroup group = permissionGroupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));
        return toResponse(group);
    }

    @Transactional
    public PermissionGroupResponseDTO createCustomGroup(PermissionGroupCreateRequestDTO request) {
        ensureCanManageGroups();
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request cannot be null");
        }
        UUID tenantId = requireTenantId(resolveCurrentTenantId());

        String normalizedName = normalizeName(request.getName());
        PermissionGroupScopeType scopeType = request.getScopeType();
        Set<PermissionAction> actions = normalizeActions(request.getActions());

        validateScopeActions(scopeType, actions);
        ensureUniqueName(tenantId, normalizedName, null);

        PermissionGroup group = new PermissionGroup();
        group.setTenantId(tenantId);
        group.setName(normalizedName);
        group.setDescription(normalizeDescription(request.getDescription()));
        group.setSource(PermissionGroupSource.CUSTOM);
        group.setCode(null);
        group.setActive(true);
        group.setScopeType(scopeType);
        group.setActions(actions);

        PermissionGroup saved = permissionGroupRepository.save(group);
        return toResponse(saved);
    }

    @Transactional
    public PermissionGroupResponseDTO updateCustomGroup(UUID id, PermissionGroupUpdateRequestDTO request) {
        ensureCanManageGroups();
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request cannot be null");
        }
        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        UUID actorUserId = resolveCurrentUserId();

        PermissionGroup group = permissionGroupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));
        Set<PermissionAction> previousActions = new LinkedHashSet<>(group.getActions());
        PermissionGroupScopeType previousScopeType = group.getScopeType();

        String normalizedName = normalizeName(request.getName());
        PermissionGroupScopeType scopeType = request.getScopeType();
        Set<PermissionAction> actions = normalizeActions(request.getActions());

        validateScopeActions(scopeType, actions);
        ensureUniqueName(tenantId, normalizedName, group.getId());
        ensureScopeChangeAllowedOrThrow(tenantId, group.getId(), previousScopeType, scopeType);

        group.setName(normalizedName);
        group.setDescription(normalizeDescription(request.getDescription()));
        group.setScopeType(scopeType);
        group.setActions(actions);

        PermissionGroup saved = permissionGroupRepository.save(group);
        syncAssignmentsAfterGroupActionChange(saved, previousActions, actions, actorUserId);
        return toResponse(saved);
    }

    @Transactional
    public PermissionGroupResponseDTO patchCustomGroup(UUID id, PermissionGroupPatchRequestDTO request) {
        ensureCanManageGroups();
        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        UUID actorUserId = resolveCurrentUserId();

        PermissionGroup group = permissionGroupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));
        Set<PermissionAction> previousActions = new LinkedHashSet<>(group.getActions());
        PermissionGroupScopeType previousScopeType = group.getScopeType();

        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request cannot be null");
        }

        if (request.getName() != null) {
            String normalizedName = normalizeName(request.getName());
            ensureUniqueName(tenantId, normalizedName, group.getId());
            group.setName(normalizedName);
        }

        if (request.getDescription() != null) {
            group.setDescription(normalizeDescription(request.getDescription()));
        }

        PermissionGroupScopeType scopeType = request.getScopeType() != null ? request.getScopeType() : group.getScopeType();
        Set<PermissionAction> actions = request.getActions() != null
                ? normalizeActions(request.getActions())
                : group.getActions();

        validateScopeActions(scopeType, actions);
        ensureScopeChangeAllowedOrThrow(tenantId, group.getId(), previousScopeType, scopeType);
        group.setScopeType(scopeType);
        group.setActions(actions);

        PermissionGroup saved = permissionGroupRepository.save(group);
        syncAssignmentsAfterGroupActionChange(saved, previousActions, actions, actorUserId);
        return toResponse(saved);
    }

    @Transactional
    public void deleteCustomGroup(UUID id) {
        ensureCanManageGroups();
        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        UUID actorUserId = resolveCurrentUserId();

        PermissionGroup group = permissionGroupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));
        ensureGroupIsCustom(group);

        List<PermissionGroupAssignment> assignments =
                permissionGroupAssignmentRepository.findAllByTenantIdAndPermissionGroupId(tenantId, group.getId());
        for (PermissionGroupAssignment assignment : assignments) {
            RevokeOutcome outcome = revokeAssignmentInternal(assignment, actorUserId, true);
            if (outcome.missingPermissionCount > 0 || !outcome.warnings.isEmpty()) {
                log.warn("While deleting permission group {}, assignment {} revoke had warnings: {}",
                        group.getId(), assignment.getId(), outcome.warnings);
            }
        }

        permissionGroupRepository.delete(group);
    }

    @Transactional
    public PermissionGroupAssignResponseDTO assignGroup(PermissionGroupAssignRequestDTO request) {
        ensureCanManageGroups();

        if (request == null || request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        UUID requestTenantId = resolveCurrentTenantId();
        UUID actorUserId = resolveCurrentUserId();
        AppUser targetUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Target user not found"));
        UUID tenantId = requireTenantId(targetUser.getTenantId());
        if (requestTenantId != null && !requestTenantId.equals(tenantId)) {
            log.warn("Tenant context mismatch during permission-group assignment. requestTenantId={}, targetUserTenantId={}, targetUserId={}",
                    requestTenantId, tenantId, targetUser.getId());
        }

        GroupSelection selection = resolveSelection(request, targetUser, tenantId);
        PermissionTargetType targetType = selection.scopeType.toTargetType();
        UUID targetId = selection.targetId;
        PermissionGroupAssignment assignment = resolveOrCreateAssignment(
                tenantId,
                selection.group.getId(),
                targetUser.getId(),
                targetType,
                targetId,
                actorUserId
        );

        int createdCount = 0;
        int skippedCount = 0;

        for (PermissionAction action : selection.actions) {
            if (!actionTargetPolicy.isAssignable(action, targetType)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Action " + action + " cannot be assigned to scope " + selection.scopeType
                );
            }

            Permission permission = findExistingPermission(targetUser.getId(), targetType, action, targetId);
            if (permission == null) {
                permission = Permission.builder()
                        .userId(targetUser.getId())
                        .targetType(targetType)
                        .targetId(targetId)
                        .action(action)
                        .manualGrant(false)
                        .build();

                if (!permissionEvaluator.canCreate(actorUserId, permission)) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "You don't have permission to assign this group");
                }

                permission = permissionRepository.save(permission);
                createdCount += 1;
            } else {
                skippedCount += 1;
            }

            ensureAssignmentLink(assignment, permission, action, targetType, targetId);
        }

        return PermissionGroupAssignResponseDTO.builder()
                .requestedCount(selection.actions.size())
                .createdCount(createdCount)
                .skippedCount(skippedCount)
                .scopeType(selection.scopeType)
                .targetType(targetType)
                .targetId(targetId)
                .build();
    }

    @Transactional(readOnly = true)
    public List<PermissionGroupAssignmentResponseDTO> listAssignmentsByUser(UUID userId) {
        ensureCanManageGroups();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        return permissionGroupAssignmentRepository
                .findAllByTenantIdAndUserIdOrderByCreatedAtDesc(tenantId, userId)
                .stream()
                .map(this::toAssignmentResponse)
                .toList();
    }

    @Transactional
    public PermissionGroupAssignmentRevokeResponseDTO revokeAssignment(UUID assignmentId) {
        ensureCanManageGroups();

        if (assignmentId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "assignmentId is required");
        }

        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        UUID actorUserId = resolveCurrentUserId();
        PermissionGroupAssignment assignment = permissionGroupAssignmentRepository
                .findByIdAndTenantId(assignmentId, tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group assignment not found"));

        RevokeOutcome outcome = revokeAssignmentInternal(assignment, actorUserId, true);

        return PermissionGroupAssignmentRevokeResponseDTO.builder()
                .assignmentId(assignment.getId())
                .groupId(assignment.getPermissionGroupId())
                .userId(assignment.getUserId())
                .targetType(assignment.getTargetType())
                .targetId(assignment.getTargetId())
                .requestedCount(outcome.requestedCount)
                .removedLinkCount(outcome.removedLinkCount)
                .deletedPermissionCount(outcome.deletedPermissionCount)
                .retainedPermissionCount(outcome.retainedPermissionCount)
                .missingPermissionCount(outcome.missingPermissionCount)
                .warnings(List.copyOf(outcome.warnings))
                .build();
    }

    private GroupSelection resolveSelection(PermissionGroupAssignRequestDTO request, AppUser targetUser, UUID tenantId) {
        boolean hasGroupId = request.getGroupId() != null;
        boolean hasPredefinedCode = request.getPredefinedCode() != null;

        if (hasGroupId == hasPredefinedCode) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Exactly one of groupId or predefinedCode must be provided");
        }

        PermissionGroup group;
        if (hasPredefinedCode) {
            permissionGroupSeedService.ensurePredefinedGroupsForTenant(tenantId);
            group = permissionGroupRepository
                    .findByTenantIdAndSourceAndCode(tenantId, PermissionGroupSource.PREDEFINED, request.getPredefinedCode())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Predefined permission group not found"));
        } else {
            group = permissionGroupRepository.findByIdAndTenantId(request.getGroupId(), tenantId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));
        }

        if (Boolean.FALSE.equals(group.getActive())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found");
        }

        UUID targetId = resolveScopeTargetId(group.getScopeType(), targetUser, request.getScopeTargetId());
        List<PermissionAction> actions = groupActionsAsList(group);
        if (actions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Permission group has no assignable actions");
        }

        return new GroupSelection(group, group.getScopeType(), actions, targetId);
    }

    private UUID resolveScopeTargetId(PermissionGroupScopeType scopeType, AppUser targetUser, UUID requestScopeTargetId) {
        if (scopeType == PermissionGroupScopeType.TENANT) {
            if (targetUser.getTenantId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Target user does not belong to a tenant");
            }
            return targetUser.getTenantId();
        }

        if (requestScopeTargetId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "scopeTargetId is required for SHOP scoped groups");
        }

        return requestScopeTargetId;
    }

    private void validateScopeActions(PermissionGroupScopeType scopeType, Set<PermissionAction> actions) {
        if (scopeType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "scopeType is required");
        }
        if (actions == null || actions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "actions are required");
        }

        PermissionTargetType targetType = scopeType.toTargetType();
        for (PermissionAction action : actions) {
            if (!actionTargetPolicy.isAssignable(action, targetType)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Action " + action + " is not assignable for scope " + scopeType);
            }
        }
    }

    private String normalizeName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }
        return name.trim();
    }

    private String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }
        String normalized = description.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private Set<PermissionAction> normalizeActions(Set<PermissionAction> actions) {
        if (actions == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "actions are required");
        }

        LinkedHashSet<PermissionAction> normalized = new LinkedHashSet<>();
        for (PermissionAction action : actions) {
            if (action != null) {
                normalized.add(action);
            }
        }

        if (normalized.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "actions are required");
        }

        return normalized;
    }

    private void ensureUniqueName(UUID tenantId, String name, UUID excludedId) {
        if (permissionGroupRepository.existsByTenantIdAndNameIgnoreCase(tenantId, name, excludedId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Permission group name already exists for this tenant");
        }
    }

    private PermissionGroupResponseDTO toResponse(PermissionGroup group) {
        PermissionGroupSource source = resolveSource(group);
        return PermissionGroupResponseDTO.builder()
                .source(source.name())
                .id(group.getId())
                .code(source == PermissionGroupSource.PREDEFINED ? group.getCode() : null)
                .name(group.getName())
                .description(group.getDescription())
                .scopeType(group.getScopeType())
                .actions(sortedActions(groupActionsAsList(group)))
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .build();
    }

    private PermissionGroupAssignmentResponseDTO toAssignmentResponse(PermissionGroupAssignment assignment) {
        PermissionGroup group = permissionGroupRepository
                .findByIdAndTenantId(assignment.getPermissionGroupId(), assignment.getTenantId())
                .orElse(null);
        PermissionGroupSource groupSource = group == null ? null : resolveSource(group);

        return PermissionGroupAssignmentResponseDTO.builder()
                .id(assignment.getId())
                .groupId(assignment.getPermissionGroupId())
                .groupName(group != null ? group.getName() : "Deleted Group")
                .groupSource(groupSource != null ? groupSource.name() : "UNKNOWN")
                .groupCode(group != null ? group.getCode() : null)
                .groupScopeType(group != null ? group.getScopeType() : null)
                .userId(assignment.getUserId())
                .targetType(assignment.getTargetType())
                .targetId(assignment.getTargetId())
                .assignedAt(assignment.getCreatedAt())
                .build();
    }

    private List<PermissionAction> sortedActions(List<PermissionAction> actions) {
        return actions.stream().sorted(Comparator.comparing(Enum::name)).toList();
    }

    private void ensureScopeChangeAllowedOrThrow(
            UUID tenantId,
            UUID groupId,
            PermissionGroupScopeType previousScopeType,
            PermissionGroupScopeType newScopeType
    ) {
        if (previousScopeType == newScopeType) {
            return;
        }

        boolean hasActiveAssignments =
                permissionGroupAssignmentRepository.existsByTenantIdAndPermissionGroupId(tenantId, groupId);
        if (hasActiveAssignments) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot change scopeType while group has active assignments"
            );
        }
    }

    private void syncAssignmentsAfterGroupActionChange(
            PermissionGroup group,
            Set<PermissionAction> previousActions,
            Set<PermissionAction> newActions,
            UUID actorUserId
    ) {
        Set<PermissionAction> oldSet = previousActions == null
                ? Set.of()
                : new LinkedHashSet<>(previousActions);
        Set<PermissionAction> nextSet = newActions == null
                ? Set.of()
                : new LinkedHashSet<>(newActions);

        if (oldSet.equals(nextSet)) {
            return;
        }

        Set<PermissionAction> addedActions = new LinkedHashSet<>(nextSet);
        addedActions.removeAll(oldSet);

        Set<PermissionAction> removedActions = new LinkedHashSet<>(oldSet);
        removedActions.removeAll(nextSet);

        if (addedActions.isEmpty() && removedActions.isEmpty()) {
            return;
        }

        List<PermissionGroupAssignment> assignments = permissionGroupAssignmentRepository
                .findAllByTenantIdAndPermissionGroupId(group.getTenantId(), group.getId());
        if (assignments.isEmpty()) {
            return;
        }

        for (PermissionGroupAssignment assignment : assignments) {
            for (PermissionAction action : addedActions) {
                if (!actionTargetPolicy.isAssignable(action, assignment.getTargetType())) {
                    log.warn(
                            "Skipping action {} for assignment {} because it is not assignable to target type {}",
                            action, assignment.getId(), assignment.getTargetType()
                    );
                    continue;
                }
                upsertPermissionForAssignment(assignment, action, actorUserId);
            }

            for (PermissionAction action : removedActions) {
                removeActionFromAssignment(assignment, action, actorUserId, null);
            }
        }
    }

    private void upsertPermissionForAssignment(
            PermissionGroupAssignment assignment,
            PermissionAction action,
            UUID actorUserId
    ) {
        Permission permission = findExistingPermission(
                assignment.getUserId(),
                assignment.getTargetType(),
                action,
                assignment.getTargetId()
        );

        if (permission == null) {
            permission = Permission.builder()
                    .userId(assignment.getUserId())
                    .targetType(assignment.getTargetType())
                    .targetId(assignment.getTargetId())
                    .action(action)
                    .manualGrant(false)
                    .build();

            if (!permissionEvaluator.canCreate(actorUserId, permission)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You don't have permission to propagate updated permission group actions"
                );
            }

            permission = permissionRepository.save(permission);
        }

        ensureAssignmentLink(assignment, permission, action, assignment.getTargetType(), assignment.getTargetId());
    }

    private RevokeOutcome revokeAssignmentInternal(
            PermissionGroupAssignment assignment,
            UUID actorUserId,
            boolean deleteAssignment
    ) {
        List<PermissionGroupAssignmentPermission> links =
                permissionGroupAssignmentPermissionRepository.findAllByPermissionGroupAssignmentId(assignment.getId());

        RevokeOutcome outcome = new RevokeOutcome();
        outcome.requestedCount = links.size();

        for (PermissionGroupAssignmentPermission link : links) {
            removeActionFromAssignment(
                    assignment,
                    link.getAction(),
                    actorUserId,
                    outcome
            );
        }

        if (deleteAssignment) {
            permissionGroupAssignmentRepository.delete(assignment);
        }

        return outcome;
    }

    private void removeActionFromAssignment(
            PermissionGroupAssignment assignment,
            PermissionAction action,
            UUID actorUserId,
            RevokeOutcome outcome
    ) {
        PermissionGroupAssignmentPermission link = permissionGroupAssignmentPermissionRepository
                .findByPermissionGroupAssignmentIdAndActionAndTargetTypeAndTargetId(
                        assignment.getId(),
                        action,
                        assignment.getTargetType(),
                        assignment.getTargetId()
                )
                .orElse(null);

        if (link == null) {
            return;
        }

        permissionGroupAssignmentPermissionRepository.delete(link);
        if (outcome != null) {
            outcome.removedLinkCount += 1;
        }

        Permission permission = permissionRepository.findById(link.getPermissionId()).orElse(null);
        if (permission == null) {
            if (outcome != null) {
                outcome.missingPermissionCount += 1;
                outcome.warnings.add("Permission not found for removed link. permissionId=" + link.getPermissionId());
            } else {
                log.warn("Permission not found while removing assignment link. assignmentId={}, permissionId={}",
                        assignment.getId(), link.getPermissionId());
            }
            return;
        }

        boolean hasOtherAssignmentLinks = permissionGroupAssignmentPermissionRepository
                .existsByPermissionIdAndPermissionGroupAssignmentIdNot(permission.getId(), assignment.getId());
        boolean isManual = !Boolean.FALSE.equals(permission.getManualGrant());

        if (hasOtherAssignmentLinks || isManual) {
            if (outcome != null) {
                outcome.retainedPermissionCount += 1;
            }
            return;
        }

        if (!permissionEvaluator.canDelete(actorUserId, permission)) {
            if (outcome != null) {
                outcome.retainedPermissionCount += 1;
                outcome.warnings.add("Permission retained due to delete authorization check. permissionId=" + permission.getId());
            } else {
                log.warn("Permission retained due to delete authorization while removing assignment link. assignmentId={}, permissionId={}",
                        assignment.getId(), permission.getId());
            }
            return;
        }

        permissionRepository.delete(permission);
        if (outcome != null) {
            outcome.deletedPermissionCount += 1;
        }
    }

    private PermissionGroupAssignment resolveOrCreateAssignment(
            UUID tenantId,
            UUID groupId,
            UUID userId,
            PermissionTargetType targetType,
            UUID targetId,
            UUID assignedBy
    ) {
        return permissionGroupAssignmentRepository
                .findByTenantIdAndPermissionGroupIdAndUserIdAndTargetTypeAndTargetId(
                        tenantId, groupId, userId, targetType, targetId
                )
                .orElseGet(() -> {
                    PermissionGroupAssignment assignment = new PermissionGroupAssignment();
                    assignment.setTenantId(tenantId);
                    assignment.setPermissionGroupId(groupId);
                    assignment.setUserId(userId);
                    assignment.setTargetType(targetType);
                    assignment.setTargetId(targetId);
                    assignment.setAssignedBy(assignedBy);
                    try {
                        return permissionGroupAssignmentRepository.save(assignment);
                    } catch (DataIntegrityViolationException ex) {
                        return permissionGroupAssignmentRepository
                                .findByTenantIdAndPermissionGroupIdAndUserIdAndTargetTypeAndTargetId(
                                        tenantId, groupId, userId, targetType, targetId
                                )
                                .orElseThrow(() -> ex);
                    }
                });
    }

    private Permission findExistingPermission(
            UUID userId,
            PermissionTargetType targetType,
            PermissionAction action,
            UUID targetId
    ) {
        List<Permission> matches = permissionRepository.findAllByUserIdAndTargetTypeAndActionAndTargetId(
                userId, targetType, action, targetId
        );
        if (matches.isEmpty()) {
            return null;
        }

        if (matches.size() > 1) {
            log.warn(
                    "Found {} duplicate permission rows for user {} action {} targetType {} targetId {}",
                    matches.size(), userId, action, targetType, targetId
            );
        }

        return matches.stream()
                .filter(p -> p.getId() != null)
                .min(Comparator.comparing(Permission::getId))
                .orElse(matches.getFirst());
    }

    private void ensureAssignmentLink(
            PermissionGroupAssignment assignment,
            Permission permission,
            PermissionAction action,
            PermissionTargetType targetType,
            UUID targetId
    ) {
        boolean linkExists = permissionGroupAssignmentPermissionRepository
                .existsByPermissionGroupAssignmentIdAndActionAndTargetTypeAndTargetId(
                        assignment.getId(),
                        action,
                        targetType,
                        targetId
                );

        if (linkExists) {
            return;
        }

        PermissionGroupAssignmentPermission link = new PermissionGroupAssignmentPermission();
        link.setTenantId(assignment.getTenantId());
        link.setPermissionGroupAssignmentId(assignment.getId());
        link.setPermissionId(permission.getId());
        link.setAction(action);
        link.setTargetType(targetType);
        link.setTargetId(targetId);

        try {
            permissionGroupAssignmentPermissionRepository.save(link);
        } catch (DataIntegrityViolationException ex) {
            log.debug("Assignment link already exists for assignment {} action {} targetType {} targetId {}",
                    assignment.getId(), action, targetType, targetId);
        }
    }

    private List<PermissionAction> groupActionsAsList(PermissionGroup group) {
        if (group.getActions() == null || group.getActions().isEmpty()) {
            return List.of();
        }
        return new ArrayList<>(group.getActions());
    }

    private PermissionGroupSource resolveSource(PermissionGroup group) {
        return group.getSource() == null ? PermissionGroupSource.CUSTOM : group.getSource();
    }

    private void ensureGroupIsCustom(PermissionGroup group) {
        if (resolveSource(group) != PermissionGroupSource.CUSTOM) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found");
        }
    }

    private UUID resolveCurrentUserId() {
        return currentUserIdResolver.resolve();
    }

    private UUID resolveCurrentTenantId() {
        return currentTenantIdResolver.resolve();
    }

    private UUID requireTenantId(UUID tenantId) {
        if (tenantId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tenant context is required for this operation");
        }
        return tenantId;
    }

    private void ensureCanManageGroups() {
        UUID userId = resolveCurrentUserId();
        if (!permissionEvaluator.canReadPermissionActions(userId)) {
            log.warn("User {} attempted to manage permission groups without sufficient permission", userId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You don't have permission to manage permission groups");
        }
    }

    private static final class RevokeOutcome {
        private int requestedCount;
        private int removedLinkCount;
        private int deletedPermissionCount;
        private int retainedPermissionCount;
        private int missingPermissionCount;
        private final List<String> warnings = new ArrayList<>();
    }

    private record GroupSelection(
            PermissionGroup group,
            PermissionGroupScopeType scopeType,
            List<PermissionAction> actions,
            UUID targetId
    ) {
    }
}
