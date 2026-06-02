package org.zerp.resource.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.resource.StockMovement;
import org.zerp.common.entity.resource.StockResource;
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
public class StockMovementPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, StockMovement target) {
        UUID stockMovementId = target.getId();
        UUID stockResourceId;
        UUID shopId;
        UUID tenantId;
        try {
            stockResourceId = target.getStockResource().getId();
            shopId = target.getStockResource().getShop().getId();
            tenantId = target.getStockResource().getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for StockMovement userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock movement structure");
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting read access to stock movement", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockMovementHierarchy(
                userId, PermissionAction.READ_STOCK_MOVEMENT, stockMovementId, stockResourceId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on stockMovement {} - permitted: {}", userId, stockMovementId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, StockResource stockResource) {
        if (commonPermissionService.isAdminAny(userId, stockResource.getTenantId())) {
            log.debug("User {} is admin for tenant {}, granting create access to stock movement", userId, stockResource.getTenantId());
            return true;
        }
        log.trace("Checking canCreate permission - userId: {}, stockResourceId: {}, tenantId: {}",
                userId, stockResource.getId(), stockResource.getTenantId());
        List<Permission> result = permissionRepository.findAllByUserAndStockMovementHierarchy(
                userId, PermissionAction.CREATE_STOCK_MOVEMENT,
                null,
                stockResource.getId(),
                stockResource.getShop().getId(),
                stockResource.getTenantId());
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    public boolean canCreateWithAction(
            UUID userId,
            UUID stockResourceId,
            UUID shopId,
            UUID tenantId,
            PermissionAction action
    ) {
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting create access to {}", userId, tenantId, action);
            return true;
        }

        log.trace("Checking {} permission - userId: {}, stockResourceId: {}, shopId: {}, tenantId: {}",
                action, userId, stockResourceId, shopId, tenantId);
        List<Permission> result = permissionRepository.findAllByUserAndStockMovementHierarchy(
                userId, action, null, stockResourceId, shopId, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("{} result for user {} - permitted: {}", action, userId, canCreate);
        return canCreate;
    }
//
    public boolean canReadByShop(UUID userId, UUID shopId, UUID tenantId) {
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting read access to stock movement by shop", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockMovementHierarchy(
                userId, PermissionAction.READ_STOCK_MOVEMENT, null, null, shopId, tenantId);
        return !result.isEmpty();
    }

    public boolean canUpdate(UUID userId, StockMovement target) {
        if (commonPermissionService.isAdminAny(userId, target.getStockResource().getTenantId())) {
            log.debug("User {} is admin for tenant {}, granting update access to stock movement", userId, target.getStockResource().getTenantId());
            return true;
        }
        log.trace("Checking canUpdate permission - userId: {}, stockMovementId: {}, stockResourceId: {}, tenantId: {}",
                userId, target.getId(), target.getStockResource().getId(), target.getStockResource().getTenantId());
        List<Permission> result = permissionRepository.findAllByUserAndStockMovementHierarchy(
                userId, PermissionAction.UPDATE_STOCK_MOVEMENT,
                target.getId(),
                target.getStockResource().getId(),
                target.getStockResource().getShop().getId(),
                target.getStockResource().getTenantId());
        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on stockMovement {} - permitted: {}", userId, target.getId(), canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, StockMovement target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, StockMovement target) {
        if (commonPermissionService.isAdminAny(userId, target.getStockResource().getTenantId())) {
            log.debug("User {} is admin for tenant {}, granting delete access to stock movement", userId, target.getStockResource().getTenantId());
            return true;
        }
        log.trace("Checking canDelete permission - userId: {}, stockMovementId: {}, stockResourceId: {}, tenantId: {}",
                userId, target.getId(), target.getStockResource().getId(), target.getStockResource().getTenantId());
        List<Permission> result = permissionRepository.findAllByUserAndStockMovementHierarchy(
                userId, PermissionAction.DELETE_STOCK_MOVEMENT,
                target.getId(),
                target.getStockResource().getId(),
                target.getStockResource().getShop().getId(),
                target.getStockResource().getTenantId());
        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on stockMovement {} - permitted: {}",
                userId, target.getId(), canDelete);
        return canDelete;
    }

    public Specification<StockMovement> filterRead(UUID userId) {

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_STOCK_MOVEMENT);
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

        Set<UUID> permittedStockResourceIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.STOCK_RESOURCE, PermissionAction.READ_STOCK_MOVEMENT);
        Set<UUID> permittedStockMovementIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.STOCK_MOVEMENT, PermissionAction.READ_STOCK_MOVEMENT);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_STOCK_MOVEMENT);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_STOCK_MOVEMENT);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedStockMovementIds),
                (root, _, _) -> root.get("stockResource").get("id").in(permittedStockResourceIds),
                (root, _, _) -> root.get("stockResource").get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
