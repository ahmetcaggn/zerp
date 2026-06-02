package org.zerp.resource.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
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
public class StockResourcePermissionEvaluator {    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, StockResource target) {
        UUID stockResourceId;
        UUID shopId;
        UUID tenantId;
        try {
            stockResourceId = target.getId();
            shopId = target.getParent().getId();
            tenantId = target.getParent().getParent().getId();
        } catch (NullPointerException e) {
            log.error("Null pointer exception while evaluating canRead permission for user {}.", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock resource structure");
        }

        log.trace("Checking canRead permission - userId: {}, stockResourceId: {}, tenantId: {}",
                userId, stockResourceId, tenantId);
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting read access to stock resource", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.READ_STOCK_RESOURCE,
                stockResourceId,
                shopId,
                tenantId
        );

        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on stockResource {} - permitted: {}",
                userId, stockResourceId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, Shop parent) {
        log.trace("Checking canCreate permission - userId: {}, shopId: {}, tenantId: {}",
                userId, parent.getId(), parent.getTenantId());
        if (commonPermissionService.isAdminAny(userId, parent.getTenantId())) {
            log.debug("User {} is admin for tenant {}, granting create access to stock resource", userId, parent.getTenantId());
            return true;
        }
        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.CREATE_STOCK_RESOURCE,
                null,
                parent.getId(),
                parent.getTenantId()
        );

        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} on shop {} - permitted: {}",
                userId, parent.getId(), canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, StockResource target) {
        UUID stockResourceId;
        UUID shopId;
        UUID tenantId;
        try {
            stockResourceId = target.getId();
            shopId = target.getParent().getId();
            tenantId = target.getParent().getParent().getId();
        } catch (NullPointerException e) {
            log.error("Null pointer exception while evaluating canRead permission for user {}.", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock resource structure");
        }

        log.trace("Checking canUpdate permission - userId: {}, stockResourceId: {}, shopId: {}, tenantId: {}",
                userId, stockResourceId, shopId, tenantId);
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting update access to stock resource", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.UPDATE_STOCK_RESOURCE,
                stockResourceId,
                shopId,
                tenantId
        );

        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on stockResource {} - permitted: {}",
                userId, stockResourceId, canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, StockResource target) {
        UUID stockResourceId;
        UUID shopId;
        UUID tenantId;
        try {
            stockResourceId = target.getId();
            shopId = target.getParent().getId();
            tenantId = target.getParent().getParent().getId();
        } catch (NullPointerException e) {
            log.error("Null pointer exception while evaluating canRead permission for user {}.", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock resource structure");
        }

        log.trace("Checking canPatch permission - userId: {}, stockResourceId: {}, shopId: {}, tenantId: {}",
                userId, stockResourceId, shopId, tenantId);
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting patch access to stock resource", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.UPDATE_STOCK_RESOURCE,
                stockResourceId,
                shopId,
                tenantId
        );

        boolean canPatch = !result.isEmpty();
        log.debug("canPatch result for user {} on stockResource {} - permitted: {}",
                userId, stockResourceId, canPatch);
        return canPatch;
    }

    public boolean canDelete(UUID userId, StockResource target) {
        UUID stockResourceId;
        UUID shopId;
        UUID tenantId;
        try {
            stockResourceId = target.getId();
            shopId = target.getParent().getId();
            tenantId = target.getParent().getParent().getId();
        } catch (NullPointerException e) {
            log.error("Null pointer exception while evaluating canRead permission for user {}.", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stock resource structure");
        }

        log.trace("Checking canDelete permission - userId: {}, stockResourceId: {}, shopId: {}, tenantId: {}",
                userId, stockResourceId, shopId, tenantId);
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting delete access to stock resource", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.DELETE_STOCK_RESOURCE,
                stockResourceId,
                shopId,
                tenantId
        );

        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on stockResource {} - permitted: {}",
                userId, stockResourceId, canDelete);
        return canDelete;
    }

    public Specification<StockResource> filterRead(UUID userId) {

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_STOCK_RESOURCE);
        if (hasRootPermission) {
            log.debug("User {} has root permission for READ_STOCK_RESOURCE, returning unrestricted specification", userId);
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
                userId, PermissionTargetType.STOCK_RESOURCE, PermissionAction.READ_STOCK_RESOURCE);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_STOCK_RESOURCE);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_STOCK_RESOURCE);

        log.debug("user {} permitted: {} stock resources, {} tenants",
                userId, permittedStockResourceIds.size(), permittedTenantIds.size());

        return Specification.anyOf(
                (root, _, _) ->
                        root.get("id").in(permittedStockResourceIds),
                (root, _, _) ->
                        root.get("shop").get("id").in(permittedShopIds),
                (root, _, _) ->
                        root.get("tenantId").in(permittedTenantIds)
        );
    }
}
