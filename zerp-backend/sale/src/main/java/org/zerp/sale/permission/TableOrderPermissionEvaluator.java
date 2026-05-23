package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.common.entity.sale.TableOrder;
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
public class TableOrderPermissionEvaluator {

    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, TableOrder target) {
        UUID orderId;
        UUID tableId;
        UUID shopId;
        UUID tenantId;
        try {
            orderId = target.getId();
            tableId = target.getShopTable().getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for TableOrder userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndTableOrderHierarchy(
                userId, PermissionAction.READ_TABLE_ORDER, orderId, tableId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on order {} - permitted: {}", userId, orderId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, ShopTable parent) {
        UUID tableId = parent.getId();
        UUID shopId = parent.getShop().getId();
        UUID tenantId = parent.getTenantId();

        List<Permission> result = permissionRepository.findAllByUserAndTableOrderHierarchy(
                userId, PermissionAction.CREATE_TABLE_ORDER, null, tableId, shopId, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, TableOrder target) {
        UUID orderId;
        UUID tableId;
        UUID shopId;
        UUID tenantId;
        try {
            orderId = target.getId();
            tableId = target.getShopTable().getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canUpdate for TableOrder userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndTableOrderHierarchy(
                userId, PermissionAction.UPDATE_TABLE_ORDER, orderId, tableId, shopId, tenantId);
        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on order {} - permitted: {}", userId, orderId, canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, TableOrder target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, TableOrder target) {
        UUID orderId;
        UUID tableId;
        UUID shopId;
        UUID tenantId;
        try {
            orderId = target.getId();
            tableId = target.getShopTable().getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canDelete for TableOrder userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndTableOrderHierarchy(
                userId, PermissionAction.DELETE_TABLE_ORDER, orderId, tableId, shopId, tenantId);
        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on order {} - permitted: {}", userId, orderId, canDelete);
        return canDelete;
    }

    public Specification<TableOrder> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_TABLE_ORDER);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedOrderIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TABLE_ORDER, PermissionAction.READ_TABLE_ORDER);
        Set<UUID> permittedTableIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP_TABLE, PermissionAction.READ_TABLE_ORDER);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_TABLE_ORDER);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_TABLE_ORDER);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedOrderIds),
                (root, _, _) -> root.get("shopTable").get("id").in(permittedTableIds),
                (root, _, _) -> root.get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
