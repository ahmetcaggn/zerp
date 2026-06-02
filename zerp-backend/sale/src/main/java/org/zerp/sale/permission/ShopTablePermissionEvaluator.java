package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.CommonPermissionService;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Component
@RequiredArgsConstructor
public class ShopTablePermissionEvaluator {    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, ShopTable target) {
        UUID tableId;
        UUID shopId;
        UUID tenantId;
        try {
            tableId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for ShopTable userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid table structure");
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting read access to table", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndShopTableHierarchy(
                userId, PermissionAction.READ_SHOP_TABLE, tableId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on table {} - permitted: {}", userId, tableId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, Shop parent) {
        UUID shopId = parent.getId();
        UUID tenantId = parent.getTenantId();

        log.trace("Checking canCreate permission - userId: {}, shopId: {}, tenantId: {}", userId, shopId, tenantId);
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting create access to table", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndShopTableHierarchy(
                userId, PermissionAction.CREATE_SHOP_TABLE, null, shopId, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, ShopTable target) {
        UUID tableId;
        UUID shopId;
        UUID tenantId;
        try {
            tableId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canUpdate for ShopTable userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid table structure");
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting update access to table", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndShopTableHierarchy(
                userId, PermissionAction.UPDATE_SHOP_TABLE, tableId, shopId, tenantId);
        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on table {} - permitted: {}", userId, tableId, canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, ShopTable target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, ShopTable target) {
        UUID tableId;
        UUID shopId;
        UUID tenantId;
        try {
            tableId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canDelete for ShopTable userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid table structure");
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting delete access to table", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndShopTableHierarchy(
                userId, PermissionAction.DELETE_SHOP_TABLE, tableId, shopId, tenantId);
        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on table {} - permitted: {}", userId, tableId, canDelete);
        return canDelete;
    }

    public Specification<ShopTable> filterRead(UUID userId) {

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_SHOP_TABLE);
        if (hasRootPermission) {
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
        log.trace("Creating filterRead specification for userId: {}", userId);

        Set<UUID> permittedTableIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP_TABLE, PermissionAction.READ_SHOP_TABLE);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_SHOP_TABLE);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_SHOP_TABLE);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedTableIds),
                (root, _, _) -> root.get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
