package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.service.PermittableService;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Component
@RequiredArgsConstructor
public class ShopTablePermissionEvaluator {

    private final PermissionRepository permissionRepository;
    private final PermittableService permittableService;

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

        List<Permission> result = permissionRepository.findAllByUserAndShopTableHierarchy(
                userId, PermissionAction.READ_SHOP_TABLE, tableId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on table {} - permitted: {}", userId, tableId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, UUID shopId, UUID tenantId) {
        log.trace("Checking canCreate permission - userId: {}, shopId: {}, tenantId: {}", userId, shopId, tenantId);
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

        List<Permission> result = permissionRepository.findAllByUserAndShopTableHierarchy(
                userId, PermissionAction.DELETE_SHOP_TABLE, tableId, shopId, tenantId);
        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on table {} - permitted: {}", userId, tableId, canDelete);
        return canDelete;
    }

    public Specification<ShopTable> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        boolean hasRootPermission = permittableService.hasRootPermission(userId, PermissionAction.READ_SHOP_TABLE);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedTableIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.SHOP_TABLE, PermissionAction.READ_SHOP_TABLE);
        Set<UUID> permittedShopIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_SHOP_TABLE);
        Set<UUID> permittedTenantIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_SHOP_TABLE);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedTableIds),
                (root, _, _) -> root.get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("shop").get("tenant").get("id").in(permittedTenantIds)
        );
    }
}
