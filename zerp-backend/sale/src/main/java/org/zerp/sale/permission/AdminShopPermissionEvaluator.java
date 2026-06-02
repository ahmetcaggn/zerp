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

import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class AdminShopPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public Specification<Shop> filterRead(UUID userId) {
        if (hasRootReadScope(userId)) {
            return Specification.unrestricted();
        }

        boolean isAdminOnTenantRoot = commonPermissionService.isAdminOnTenantRoot(userId);
        if (isAdminOnTenantRoot) {
            return Specification.unrestricted();
        }

        UUID managingTenantId = commonPermissionService.getTenantIdIfTheUserIsAdminOnIt(userId);
        if (managingTenantId != null) {
            return (root, _, _) -> root.get("tenantId").equalTo(managingTenantId);
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
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting read access to shop {}", userId, tenantId, shopId);
            return true;
        }

        return hasRootReadScope(userId)
                || hasTenantPermission(userId, PermissionAction.READ_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.ADMIN, tenantId)
                || !permissionRepository.findAllByUserAndShopHierarchy(userId, PermissionAction.READ_SHOP, shopId, tenantId).isEmpty();
    }

    public boolean canCreate(UUID userId, UUID tenantId) {
        if (tenantId == null) {
            return false;
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting create access", userId, tenantId);
            return true;
        }

        return hasRootWriteScope(userId)
                || hasTenantPermission(userId, PermissionAction.UPDATE_TENANT, tenantId)
                || hasTenantPermission(userId, PermissionAction.ADMIN, tenantId);
    }

    public boolean canUpdate(UUID userId, UUID tenantId) {
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting update access", userId, tenantId);
            return true;
        }

        return canCreate(userId, tenantId);
    }

    public boolean canPatch(UUID userId, UUID tenantId) {
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting patch access", userId, tenantId);
            return true;
        }

        return canUpdate(userId, tenantId);
    }

    public boolean canDelete(UUID userId, UUID tenantId) {
        if (tenantId == null) {
            return false;
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting delete access", userId, tenantId);
            return true;
        }

        return hasRootAdmin(userId)
                || hasTenantPermission(userId, PermissionAction.ADMIN, tenantId);
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
                userId, PermissionTargetType.TENANT, PermissionAction.ADMIN
        ));
        return readableTenantIds;
    }

    private boolean hasTenantPermission(UUID userId, PermissionAction action, UUID tenantId) {
        return permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                userId, PermissionTargetType.TENANT, action, tenantId
        );
    }

    private boolean hasRootAdmin(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.ADMIN);
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
