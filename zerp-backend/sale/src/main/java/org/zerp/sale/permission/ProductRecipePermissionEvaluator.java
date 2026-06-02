package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.sale.Product;
import org.zerp.common.entity.sale.ProductRecipe;
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
public class ProductRecipePermissionEvaluator {    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, ProductRecipe target) {
        UUID recipeId;
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            recipeId = target.getId();
            productId = target.getProduct().getId();
            shopId = target.getProduct().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for ProductRecipe userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product recipe structure");
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting read access to recipe", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductRecipeHierarchy(
                userId, PermissionAction.READ_PRODUCT_RECIPE, recipeId, productId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on productRecipe {} - permitted: {}", userId, recipeId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, Product parent) {
        UUID productId = parent.getId();
        UUID shopId = parent.getShop().getId();
        UUID tenantId = parent.getTenantId();

        log.trace("Checking canCreate permission - userId: {}, productId: {}, tenantId: {}",
                userId, productId, tenantId);
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting create access to recipe", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductRecipeHierarchy(
                userId, PermissionAction.CREATE_PRODUCT_RECIPE, null, productId, shopId, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, ProductRecipe target) {
        UUID recipeId;
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            recipeId = target.getId();
            productId = target.getProduct().getId();
            shopId = target.getProduct().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canUpdate for ProductRecipe userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product recipe structure");
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting update access to recipe", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductRecipeHierarchy(
                userId, PermissionAction.UPDATE_PRODUCT_RECIPE, recipeId, productId, shopId, tenantId);
        return !result.isEmpty();
    }

    public boolean canPatch(UUID userId, ProductRecipe target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, ProductRecipe target) {
        UUID recipeId;
        UUID productId;
        UUID shopId;
        UUID tenantId;
        try {
            recipeId = target.getId();
            productId = target.getProduct().getId();
            shopId = target.getProduct().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canDelete for ProductRecipe userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product recipe structure");
        }
        if (commonPermissionService.isAdminAny(userId, tenantId)) {
            log.debug("User {} is admin for tenant {}, granting delete access to recipe", userId, tenantId);
            return true;
        }

        List<Permission> result = permissionRepository.findAllByUserAndProductRecipeHierarchy(
                userId, PermissionAction.DELETE_PRODUCT_RECIPE, recipeId, productId, shopId, tenantId);
        return !result.isEmpty();
    }

    public Specification<ProductRecipe> filterRead(UUID userId) {
        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_PRODUCT_RECIPE);
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

        Set<UUID> permittedRecipeIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.PRODUCT_RECIPE, PermissionAction.READ_PRODUCT_RECIPE);
        Set<UUID> permittedProductIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.PRODUCT, PermissionAction.READ_PRODUCT_RECIPE);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_PRODUCT_RECIPE);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_PRODUCT_RECIPE);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedRecipeIds),
                (root, _, _) -> root.get("product").get("id").in(permittedProductIds),
                (root, _, _) -> root.get("product").get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
