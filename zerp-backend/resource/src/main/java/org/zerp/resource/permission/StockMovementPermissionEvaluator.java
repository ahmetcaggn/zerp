package org.zerp.resource.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.resource.StockMovement;
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
public class StockMovementPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final PermittableService permittableService;

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

        List<Permission> result = permissionRepository.findAllByUserAndStockMovementHierarchy(
                userId, PermissionAction.READ_STOCK_MOVEMENT, stockMovementId, stockResourceId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on stockMovement {} - permitted: {}", userId, stockMovementId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, UUID stockResourceId, UUID tenantId) {
        log.trace("Checking canCreate permission - userId: {}, stockResourceId: {}, tenantId: {}", userId, stockResourceId, tenantId);
        List<Permission> result = permissionRepository.findAllByUserAndStockMovementHierarchy(
                userId, PermissionAction.CREATE_STOCK_MOVEMENT, null, stockResourceId, null, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, StockMovement target) {
        return canRead(userId, target);
    }

    public boolean canPatch(UUID userId, StockMovement target) {
        return canRead(userId, target);
    }

    public boolean canDelete(UUID userId, StockMovement target) {
        return canRead(userId, target);
    }

    public Specification<StockMovement> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        boolean hasRootPermission = permittableService.hasRootPermission(userId, PermissionAction.READ_STOCK_MOVEMENT);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedStockResourceIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.STOCK_RESOURCE, PermissionAction.READ_STOCK_MOVEMENT);
        Set<UUID> permittedShopIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_STOCK_MOVEMENT);
        Set<UUID> permittedTenantIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_STOCK_MOVEMENT);

        return Specification.anyOf(
                (root, _, _) -> root.get("stockResource").get("id").in(permittedStockResourceIds),
                (root, _, _) -> root.get("stockResource").get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("stockResource").get("shop").get("tenant").get("id").in(permittedTenantIds)
        );
    }
}
