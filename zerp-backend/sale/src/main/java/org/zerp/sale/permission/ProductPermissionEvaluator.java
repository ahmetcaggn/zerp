package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.Product;
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
public class ProductPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, Product target) {
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            productId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for Product userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductHierarchy(
                userId, PermissionAction.READ_PRODUCT, productId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on product {} - permitted: {}", userId, productId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, Shop parent) {
        UUID shopId = parent.getId();
        UUID tenantId = parent.getTenantId();

        log.trace("Checking canCreate permission - userId: {}, shopId: {}, tenantId: {}", userId, shopId, tenantId);
        List<Permission> result = permissionRepository.findAllByUserAndProductHierarchy(
                userId, PermissionAction.CREATE_PRODUCT, null, shopId, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, Product target) {
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            productId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canUpdate for Product userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductHierarchy(
                userId, PermissionAction.UPDATE_PRODUCT, productId, shopId, tenantId);
        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on product {} - permitted: {}", userId, productId, canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, Product target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, Product target) {
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            productId = target.getId();
            shopId = target.getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canDelete for Product userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductHierarchy(
                userId, PermissionAction.DELETE_PRODUCT, productId, shopId, tenantId);
        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on product {} - permitted: {}", userId, productId, canDelete);
        return canDelete;
    }

    public Specification<Product> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_PRODUCT);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedProductIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.PRODUCT, PermissionAction.READ_PRODUCT);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_PRODUCT);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_PRODUCT);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedProductIds),
                (root, _, _) -> root.get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
