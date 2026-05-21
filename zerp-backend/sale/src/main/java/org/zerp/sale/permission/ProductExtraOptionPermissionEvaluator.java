package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.sale.ProductExtraOption;
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
public class ProductExtraOptionPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, ProductExtraOption target) {
        UUID extraOptionId;
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            extraOptionId = target.getId();
            productId = target.getProduct().getId();
            shopId = target.getProduct().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for ProductExtraOption userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product extra option structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductExtraOptionHierarchy(
                userId, PermissionAction.READ_PRODUCT_EXTRA_OPTION, extraOptionId, productId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on productExtraOption {} - permitted: {}", userId, extraOptionId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, UUID productId, UUID tenantId) {
        log.trace("Checking canCreate permission - userId: {}, productId: {}, tenantId: {}", userId, productId, tenantId);
        List<Permission> result = permissionRepository.findAllByUserAndProductExtraOptionHierarchy(
                userId, PermissionAction.CREATE_PRODUCT_EXTRA_OPTION, null, productId, null, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, ProductExtraOption target) {
        UUID extraOptionId;
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            extraOptionId = target.getId();
            productId = target.getProduct().getId();
            shopId = target.getProduct().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canUpdate for ProductExtraOption userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product extra option structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductExtraOptionHierarchy(
                userId, PermissionAction.UPDATE_PRODUCT_EXTRA_OPTION, extraOptionId, productId, shopId, tenantId);
        return !result.isEmpty();
    }

    public boolean canPatch(UUID userId, ProductExtraOption target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, ProductExtraOption target) {
        UUID extraOptionId;
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            extraOptionId = target.getId();
            productId = target.getProduct().getId();
            shopId = target.getProduct().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canDelete for ProductExtraOption userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product extra option structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductExtraOptionHierarchy(
                userId, PermissionAction.DELETE_PRODUCT_EXTRA_OPTION, extraOptionId, productId, shopId, tenantId);
        return !result.isEmpty();
    }

    public Specification<ProductExtraOption> filterRead(UUID userId) {
        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_PRODUCT_EXTRA_OPTION);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedExtraOptionIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.PRODUCT_EXTRA_OPTION, PermissionAction.READ_PRODUCT_EXTRA_OPTION);
        Set<UUID> permittedProductIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.PRODUCT, PermissionAction.READ_PRODUCT_EXTRA_OPTION);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_PRODUCT_EXTRA_OPTION);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_PRODUCT_EXTRA_OPTION);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedExtraOptionIds),
                (root, _, _) -> root.get("product").get("id").in(permittedProductIds),
                (root, _, _) -> root.get("product").get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
