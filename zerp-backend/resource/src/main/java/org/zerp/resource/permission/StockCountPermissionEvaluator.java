package org.zerp.resource.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.resource.StockCount;
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
public class StockCountPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, StockCount target) {
        UUID stockCountId;
        UUID shopId;
        UUID tenantId;
        try {
            stockCountId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for StockCount userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock count structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockCountHierarchy(
                userId, PermissionAction.READ_STOCK_COUNT, stockCountId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on stockCount {} - permitted: {}", userId, stockCountId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, UUID shopId, UUID tenantId) {
        log.trace("Checking canCreate permission - userId: {}, shopId: {}, tenantId: {}", userId, shopId, tenantId);
        List<Permission> result = permissionRepository.findAllByUserAndStockCountHierarchy(
                userId, PermissionAction.CREATE_STOCK_COUNT, null, shopId, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, StockCount target) {
        UUID stockCountId;
        UUID shopId;
        UUID tenantId;
        try {
            stockCountId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canUpdate for StockCount userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock count structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockCountHierarchy(
                userId, PermissionAction.UPDATE_STOCK_COUNT, stockCountId, shopId, tenantId);
        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on stockCount {} - permitted: {}", userId, stockCountId, canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, StockCount target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, StockCount target) {
        UUID stockCountId;
        UUID shopId;
        UUID tenantId;
        try {
            stockCountId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canDelete for StockCount userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock count structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockCountHierarchy(
                userId, PermissionAction.DELETE_STOCK_COUNT, stockCountId, shopId, tenantId);
        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on stockCount {} - permitted: {}", userId, stockCountId, canDelete);
        return canDelete;
    }

    public Specification<StockCount> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_STOCK_COUNT);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedStockCountIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.STOCK_COUNT, PermissionAction.READ_STOCK_COUNT);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_STOCK_COUNT);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_STOCK_COUNT);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedStockCountIds),
                (root, _, _) -> root.get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
