package org.zerp.user.permission;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.Tenant;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.CommonPermissionService;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AdminTenantPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public Specification<Tenant> filterRead(UUID userId) {
        if (hasRootReadScope(userId)) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedTenantIds = new HashSet<>(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_TENANT));
        permittedTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.UPDATE_TENANT));
        permittedTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.ADMIN));

        if (permittedTenantIds.isEmpty()) {
            return (_, _, cb) -> cb.disjunction();
        }

        return (root, _, _) -> root.get("id").in(permittedTenantIds);
    }

    public boolean canRead(UUID userId, UUID tenantId) {
        return hasRootReadScope(userId)
                || hasTenantPermission(userId, PermissionAction.READ_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.ADMIN, tenantId);
    }

    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    public boolean canCreate(UUID userId) {
        return hasRootAdmin(userId);
    }

    public boolean canUpdate(UUID userId, UUID tenantId) {
        return hasRootUpdateScope(userId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.ADMIN, tenantId);
    }

    public boolean canPatch(UUID userId, UUID tenantId) {
        return canUpdate(userId, tenantId);
    }

    public boolean canDelete(UUID userId, UUID tenantId) {
        return hasRootAdmin(userId)
                || hasTenantPermission(userId, PermissionAction.ADMIN, tenantId);
    }

    private boolean hasTenantPermission(UUID userId, PermissionAction action, UUID tenantId) {
        return permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                userId, PermissionTargetType.TENANT, action, tenantId);
    }

    private boolean hasRootAdmin(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.ADMIN);
    }

    private boolean hasRootReadScope(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.READ_TENANT)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.UPDATE_TENANT)
                || hasRootAdmin(userId);
    }

    private boolean hasRootUpdateScope(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.UPDATE_TENANT)
                || hasRootAdmin(userId);
    }
}
