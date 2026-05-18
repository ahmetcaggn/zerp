package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.Shop;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.CommonPermissionService;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AdminShopPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public Specification<Shop> filterRead(UUID userId) {
        if (hasRootReadScope(userId)) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedShopIds = new HashSet<>(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_SHOP
        ));

        Set<UUID> permittedTenantIds = collectReadableTenantIds(userId);

        if (permittedShopIds.isEmpty() && permittedTenantIds.isEmpty()) {
            return (_, _, cb) -> cb.disjunction();
        }

        if (permittedShopIds.isEmpty()) {
            return (root, _, _) -> root.get("tenantId").in(permittedTenantIds);
        }

        if (permittedTenantIds.isEmpty()) {
            return (root, _, _) -> root.get("id").in(permittedShopIds);
        }

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }

    public boolean canRead(UUID userId, Shop shop) {
        if (shop == null || shop.getTenantId() == null || shop.getId() == null) {
            return false;
        }

        UUID tenantId = shop.getTenantId();
        UUID shopId = shop.getId();

        return hasRootReadScope(userId)
                || hasTenantPermission(userId, PermissionAction.READ_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.ADMIN_TENANT, tenantId)
                || !permissionRepository.findAllByUserAndShopHierarchy(userId, PermissionAction.READ_SHOP, shopId, tenantId).isEmpty();
    }

    public boolean canCreate(UUID userId, UUID tenantId) {
        if (tenantId == null) {
            return false;
        }
        return hasRootWriteScope(userId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.ADMIN_TENANT, tenantId);
    }

    public boolean canUpdate(UUID userId, UUID tenantId) {
        return canCreate(userId, tenantId);
    }

    public boolean canPatch(UUID userId, UUID tenantId) {
        return canUpdate(userId, tenantId);
    }

    public boolean canDelete(UUID userId, UUID tenantId) {
        if (tenantId == null) {
            return false;
        }
        return hasRootAdmin(userId)
                || hasTenantPermission(userId, PermissionAction.ADMIN_TENANT, tenantId);
    }

    private Set<UUID> collectReadableTenantIds(UUID userId) {
        Set<UUID> readableTenantIds = new HashSet<>(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_SHOP
        ));
        readableTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_TENANT
        ));
        readableTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.UPDATE_TENANT
        ));
        readableTenantIds.addAll(commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.ADMIN_TENANT
        ));
        return readableTenantIds;
    }

    private boolean hasTenantPermission(UUID userId, PermissionAction action, UUID tenantId) {
        return permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                userId, PermissionTargetType.TENANT, action, tenantId
        );
    }

    private boolean hasRootAdmin(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.ADMIN_TENANT);
    }

    private boolean hasRootReadScope(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.READ_SHOP)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.READ_TENANT)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.UPDATE_TENANT)
                || hasRootAdmin(userId);
    }

    private boolean hasRootWriteScope(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.UPDATE_TENANT)
                || hasRootAdmin(userId);
    }
}
