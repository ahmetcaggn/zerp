package org.zerp.sale.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
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
public class ShopPermissionEvaluator {

    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, Shop target) {
        UUID shopId;
        UUID tenantId;
        try {
            shopId = target.getId();
            tenantId = target.getTenantId();
        } catch (NullPointerException e) {
            log.error("Null pointer while evaluating canRead for Shop userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid shop structure");
        }

        List<Permission> result = permissionRepository.findAllByUserAndShopHierarchy(
                userId, PermissionAction.READ_SHOP, shopId, tenantId);
        boolean canRead = !result.isEmpty();
        log.debug("canRead result for user {} on shop {} - permitted: {}", userId, shopId, canRead);
        return canRead;
    }

    public Specification<Shop> filterRead(UUID userId) {
        log.trace("Creating filterRead specification for userId: {}", userId);

        boolean hasRootPermission = commonPermissionService.hasRootPermission(userId, PermissionAction.READ_SHOP);
        if (hasRootPermission) {
            return Specification.unrestricted();
        }

        Set<UUID> permittedShopIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.SHOP, PermissionAction.READ_SHOP);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                userId, PermissionTargetType.TENANT, PermissionAction.READ_SHOP);

        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedShopIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
