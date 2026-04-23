package org.zerp.resource.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.resource.StockResource;
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
public class StockResourcePermissionEvaluator {
    public record StockResourceTarget(UUID stockResourceId, UUID tenantId) {
    }

    public record TenantParent(UUID tenantId) {
    }

    private final PermissionRepository permissionRepository;
    private final PermittableService permittableService;

    public boolean canRead(UUID userId, StockResourceTarget target) {
        final UUID stockResourceId = target.stockResourceId();
        final UUID tenantId = target.tenantId();

        log.trace("Checking canRead permission - userId: {}, stockResourceId: {}, tenantId: {}",
                userId, stockResourceId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.READ_STOCK_RESOURCE,
                stockResourceId,
                tenantId
        );

        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on stockResource {} - permitted: {}",
                userId, stockResourceId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, TenantParent parent) {
        final UUID tenantId = parent.tenantId();

        log.trace("Checking canCreate permission - userId: {}, tenantId: {}", userId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.CREATE_STOCK_RESOURCE,
                null,
                tenantId
        );

        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} in tenant {} - permitted: {}",
                userId, tenantId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, StockResourceTarget target) {
        final UUID stockResourceId = target.stockResourceId();
        final UUID tenantId = target.tenantId();

        log.trace("Checking canUpdate permission - userId: {}, stockResourceId: {}, tenantId: {}",
                userId, stockResourceId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.UPDATE_STOCK_RESOURCE,
                stockResourceId,
                tenantId
        );

        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on stockResource {} - permitted: {}",
                userId, stockResourceId, canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, StockResourceTarget target) {
        final UUID stockResourceId = target.stockResourceId();
        final UUID tenantId = target.tenantId();

        log.trace("Checking canPatch permission - userId: {}, stockResourceId: {}, tenantId: {}",
                userId, stockResourceId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.UPDATE_STOCK_RESOURCE,
                stockResourceId,
                tenantId
        );

        boolean canPatch = !result.isEmpty();
        log.debug("canPatch result for user {} on stockResource {} - permitted: {}",
                userId, stockResourceId, canPatch);
        return canPatch;
    }

    public boolean canDelete(UUID userId, StockResourceTarget target) {
        final UUID stockResourceId = target.stockResourceId();
        final UUID tenantId = target.tenantId();

        log.trace("Checking canDelete permission - userId: {}, stockResourceId: {}, tenantId: {}",
                userId, stockResourceId, tenantId);

        List<Permission> result = permissionRepository.findAllByUserAndStockResourceHierarchy(
                userId,
                PermissionAction.DELETE_STOCK_RESOURCE,
                stockResourceId,
                tenantId
        );

        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on stockResource {} - permitted: {}",
                userId, stockResourceId, canDelete);
        return canDelete;
    }

    public Specification<StockResource> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        Set<UUID> permittedStockResourceIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.STOCK_RESOURCE, PermissionAction.READ_STOCK_RESOURCE);
        Set<UUID> permittedTenantIds = permittableService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_STOCK_RESOURCE);

        log.debug("user {} permitted: {} stock resources, {} tenants",
                userId, permittedStockResourceIds.size(), permittedTenantIds.size());

        return Specification.anyOf(
                (root, _, _) ->
                        root.get("id").in(permittedStockResourceIds),
                (root, _, _) ->
                        root.get("tenant").get("id").in(permittedTenantIds)
        );
    }
}
