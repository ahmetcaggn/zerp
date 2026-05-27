package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionGroup;
import org.zerp.common.permission.entity.PermissionGroupScopeType;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PredefinedPermissionGroupCode;
import org.zerp.common.permission.repository.PermissionGroupRepository;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.common.entity.user.AppUser;
import org.zerp.user.dto.permissiongroup.PermissionGroupAssignRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupAssignResponseDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupCreateRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupPatchRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupResponseDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupUpdateRequestDTO;
import org.zerp.user.permission.PermissionActionTargetPolicy;
import org.zerp.user.permission.PermissionPermissionEvaluator;
import org.zerp.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class PermissionGroupService {
    private static final String SOURCE_PREDEFINED = "PREDEFINED";
    private static final String SOURCE_CUSTOM = "CUSTOM";

    private final PermissionGroupRepository permissionGroupRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PermissionPermissionEvaluator permissionEvaluator;
    private final PermissionActionTargetPolicy actionTargetPolicy;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;

    @Transactional(readOnly = true)
    public List<PermissionGroupResponseDTO> getPredefinedGroups() {
        ensureCanManageGroups();
        return Arrays.stream(PredefinedPermissionGroupCode.values())
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
        return toResponse(code);
    }

    @Transactional(readOnly = true)
    public List<PermissionGroupResponseDTO> getCustomGroups() {
        ensureCanManageGroups();
        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        return permissionGroupRepository.findAllByTenantIdOrderByNameAsc(tenantId).stream()
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

        PermissionGroup group = permissionGroupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));

        String normalizedName = normalizeName(request.getName());
        PermissionGroupScopeType scopeType = request.getScopeType();
        Set<PermissionAction> actions = normalizeActions(request.getActions());

        validateScopeActions(scopeType, actions);
        ensureUniqueName(tenantId, normalizedName, group.getId());

        group.setName(normalizedName);
        group.setDescription(normalizeDescription(request.getDescription()));
        group.setScopeType(scopeType);
        group.setActions(actions);

        return toResponse(permissionGroupRepository.save(group));
    }

    @Transactional
    public PermissionGroupResponseDTO patchCustomGroup(UUID id, PermissionGroupPatchRequestDTO request) {
        ensureCanManageGroups();
        UUID tenantId = requireTenantId(resolveCurrentTenantId());

        PermissionGroup group = permissionGroupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));

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
        group.setScopeType(scopeType);
        group.setActions(actions);

        return toResponse(permissionGroupRepository.save(group));
    }

    @Transactional
    public void deleteCustomGroup(UUID id) {
        ensureCanManageGroups();
        UUID tenantId = requireTenantId(resolveCurrentTenantId());

        PermissionGroup group = permissionGroupRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));

        permissionGroupRepository.delete(group);
    }

    @Transactional
    public PermissionGroupAssignResponseDTO assignGroup(PermissionGroupAssignRequestDTO request) {
        ensureCanManageGroups();

        if (request == null || request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        UUID actorUserId = resolveCurrentUserId();
        AppUser targetUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Target user not found"));

        GroupSelection selection = resolveSelection(request, targetUser);
        PermissionTargetType targetType = selection.scopeType.toTargetType();
        UUID targetId = selection.targetId;

        int createdCount = 0;
        int skippedCount = 0;

        for (PermissionAction action : selection.actions) {
            if (!actionTargetPolicy.isAssignable(action, targetType)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Action " + action + " cannot be assigned to scope " + selection.scopeType
                );
            }

            boolean exists = permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                    targetUser.getId(),
                    targetType,
                    action,
                    targetId
            );

            if (exists) {
                skippedCount += 1;
                continue;
            }

            Permission permission = Permission.builder()
                    .userId(targetUser.getId())
                    .targetType(targetType)
                    .targetId(targetId)
                    .action(action)
                    .build();

            if (!permissionEvaluator.canCreate(actorUserId, permission)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You don't have permission to assign this group");
            }

            permissionRepository.save(permission);
            createdCount += 1;
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

    private GroupSelection resolveSelection(PermissionGroupAssignRequestDTO request, AppUser targetUser) {
        boolean hasGroupId = request.getGroupId() != null;
        boolean hasPredefinedCode = request.getPredefinedCode() != null;

        if (hasGroupId == hasPredefinedCode) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Exactly one of groupId or predefinedCode must be provided");
        }

        if (hasPredefinedCode) {
            PredefinedPermissionGroupCode predefined = request.getPredefinedCode();
            UUID targetId = resolveScopeTargetId(predefined.scopeType(), targetUser, request.getScopeTargetId());
            return new GroupSelection(predefined.scopeType(), predefined.actions(), targetId);
        }

        UUID tenantId = requireTenantId(resolveCurrentTenantId());
        PermissionGroup customGroup = permissionGroupRepository.findByIdAndTenantId(request.getGroupId(), tenantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission group not found"));

        UUID targetId = resolveScopeTargetId(customGroup.getScopeType(), targetUser, request.getScopeTargetId());
        List<PermissionAction> actions = new ArrayList<>(customGroup.getActions());

        return new GroupSelection(customGroup.getScopeType(), actions, targetId);
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

    private PermissionGroupResponseDTO toResponse(PredefinedPermissionGroupCode code) {
        return PermissionGroupResponseDTO.builder()
                .source(SOURCE_PREDEFINED)
                .code(code)
                .name(code.displayName())
                .description(code.description())
                .scopeType(code.scopeType())
                .actions(sortedActions(code.actions()))
                .build();
    }

    private PermissionGroupResponseDTO toResponse(PermissionGroup group) {
        return PermissionGroupResponseDTO.builder()
                .source(SOURCE_CUSTOM)
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .scopeType(group.getScopeType())
                .actions(sortedActions(new ArrayList<>(group.getActions())))
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .build();
    }

    private List<PermissionAction> sortedActions(List<PermissionAction> actions) {
        return actions.stream().sorted(Comparator.comparing(Enum::name)).toList();
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

    private record GroupSelection(PermissionGroupScopeType scopeType, List<PermissionAction> actions, UUID targetId) {
    }
}
