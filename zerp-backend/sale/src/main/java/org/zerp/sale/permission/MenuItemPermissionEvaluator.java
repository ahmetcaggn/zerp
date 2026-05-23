package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.sale.MenuCategory;
import org.zerp.common.entity.sale.MenuItem;
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
public class MenuItemPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, MenuItem target) {
        UUID itemId;
        UUID categoryId;
        UUID menuId;
        UUID shopId;
        UUID tenantId;
        try {
            itemId = target.getId();
            categoryId = target.getCategory().getId();
            menuId = target.getCategory().getMenu().getId();
            shopId = target.getCategory().getMenu().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for MenuItem userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid menu item structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndMenuItemHierarchy(
                userId, PermissionAction.READ_MENU_ITEM, itemId, categoryId, menuId, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on menuItem {} - permitted: {}", userId, itemId, canRead);
        return canRead;
    }

    public boolean canCreate(UUID userId, MenuCategory parent) {
        UUID categoryId = parent.getId();
        UUID menuId = parent.getMenu().getId();
        UUID shopId = parent.getMenu().getShop().getId();
        UUID tenantId = parent.getTenantId();

        log.trace("Checking canCreate permission - userId: {}, categoryId: {}, menuId: {}, tenantId: {}",
                userId, categoryId, menuId, tenantId);
        List<Permission> result = permissionRepository.findAllByUserAndMenuItemHierarchy(
                userId, PermissionAction.CREATE_MENU_ITEM, null, categoryId, menuId, shopId, tenantId);
        boolean canCreate = !result.isEmpty();
        log.debug("canCreate result for user {} on category {} - permitted: {}", userId, categoryId, canCreate);
        return canCreate;
    }

    public boolean canUpdate(UUID userId, MenuItem target) {
        UUID itemId;
        UUID categoryId;
        UUID menuId;
        UUID shopId;
        UUID tenantId;
        try {
            itemId = target.getId();
            categoryId = target.getCategory().getId();
            menuId = target.getCategory().getMenu().getId();
            shopId = target.getCategory().getMenu().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canUpdate for MenuItem userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid menu item structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndMenuItemHierarchy(
                userId, PermissionAction.UPDATE_MENU_ITEM, itemId, categoryId, menuId, shopId, tenantId);
        boolean canUpdate = !result.isEmpty();
        log.debug("canUpdate result for user {} on menuItem {} - permitted: {}", userId, itemId, canUpdate);
        return canUpdate;
    }

    public boolean canPatch(UUID userId, MenuItem target) {
        return canUpdate(userId, target);
    }

    public boolean canDelete(UUID userId, MenuItem target) {
        UUID itemId;
        UUID categoryId;
        UUID menuId;
        UUID shopId;
        UUID tenantId;
        try {
            itemId = target.getId();
            categoryId = target.getCategory().getId();
            menuId = target.getCategory().getMenu().getId();
            shopId = target.getCategory().getMenu().getShop().getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canDelete for MenuItem userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid menu item structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndMenuItemHierarchy(
                userId, PermissionAction.DELETE_MENU_ITEM, itemId, categoryId, menuId, shopId, tenantId);
        boolean canDelete = !result.isEmpty();
        log.debug("canDelete result for user {} on menuItem {} - permitted: {}", userId, itemId, canDelete);
        return canDelete;
    }

    public Specification<MenuItem> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_MENU_ITEM);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedItemIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.MENU_ITEM, PermissionAction.READ_MENU_ITEM);
        Set<UUID> permittedCategoryIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.MENU_CATEGORY, PermissionAction.READ_MENU_ITEM);
        Set<UUID> permittedMenuIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.MENU, PermissionAction.READ_MENU_ITEM);
        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_MENU_ITEM);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_MENU_ITEM);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedItemIds),
                (root, _, _) -> root.get("category").get("id").in(permittedCategoryIds),
                (root, _, _) -> root.get("category").get("menu").get("id").in(permittedMenuIds),
                (root, _, _) -> root.get("category").get("menu").get("shop").get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
