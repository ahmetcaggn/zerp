package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.sale.MenuCategory;
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
public class MenuCategoryPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, MenuCategory target) {
        UUID categoryId;
        UUID menuId;
        UUID shopId;
        UUID tenantId;
        try {
            categoryId = target.getId();
            menuId = target.getMenu().getId();
            shopId = target.getMenu().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for MenuCategory userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid menu category structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndMenuCategoryHierarchy(
                userId, PermissionAction.READ_MENU_CATEGORY, categoryId, menuId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on menuCategory {} - permitted: {}", userId, categoryId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, UUID menuId, UUID tenantId) {
        log.trace("Checking canCreate permission - userId: {}, menuId: {}, tenantId: {}", userId, menuId, tenantId);
        List<Permission> result = permissionRepository.findAllByUserAndMenuCategoryHierarchy(
                userId, PermissionAction.CREATE_MENU_CATEGORY, null, menuId, null, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} - permitted: {}", userId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, MenuCategory target) {
        UUID categoryId;
        UUID menuId;
        UUID shopId;
        UUID tenantId;
        try {
            categoryId = target.getId();
            menuId = target.getMenu().getId();
            shopId = target.getMenu().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canUpdate for MenuCategory userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid menu category structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndMenuCategoryHierarchy(
                userId, PermissionAction.UPDATE_MENU_CATEGORY, categoryId, menuId, shopId, tenantId);
        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on menuCategory {} - permitted: {}", userId, categoryId, canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, MenuCategory target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, MenuCategory target) {
        UUID categoryId;
        UUID menuId;
        UUID shopId;
        UUID tenantId;
        try {
            categoryId = target.getId();
            menuId = target.getMenu().getId();
            shopId = target.getMenu().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canDelete for MenuCategory userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid menu category structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndMenuCategoryHierarchy(
                userId, PermissionAction.DELETE_MENU_CATEGORY, categoryId, menuId, shopId, tenantId);
        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on menuCategory {} - permitted: {}", userId, categoryId, canDelete);
        return canDelete;
    }

    public Specification<MenuCategory> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_MENU_CATEGORY);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedCategoryIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.MENU_CATEGORY, PermissionAction.READ_MENU_CATEGORY);
        Set<UUID> permittedMenuIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.MENU, PermissionAction.READ_MENU_CATEGORY);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_MENU_CATEGORY);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_MENU_CATEGORY);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedCategoryIds),
                (root, _, _) -> root.get("menu").get("id").in(permittedMenuIds),
                (root, _, _) -> root.get("menu").get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
