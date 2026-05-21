package org.zerp.user.permission;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.user.AppUser;
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
public class UserPermissionEvaluator {
    private final PermissionRepository permissionRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID requesterId, AppUser target) {
        List<Permission> permissions = permissionRepository.findAllByUserAndUserHierarchy(
                requesterId,
                PermissionAction.READ_USER,
                target.getId(),
                target.getParent().getId()
        );

        log.debug("User {} has {} read permissions for user {}",
                requesterId, permissions.size(), target.getId());

        return !permissions.isEmpty();
    }

    public Specification<AppUser> filterRead(UUID requesterId) {
        Set<UUID> permittedUserIds = commonPermissionService.getAllPermitted(
                requesterId, PermissionTargetType.USER, PermissionAction.READ_USER);
        Set<UUID> permittedTenantIds = commonPermissionService.getAllPermitted(
                requesterId, PermissionTargetType.TENANT, PermissionAction.READ_USER);

        log.debug("User {} has read permissions for {} users and {} tenants",
                requesterId, permittedUserIds.size(), permittedTenantIds.size());

        // If user has no permissions, deny access by returning a specification that matches nothing
        if (permittedUserIds.isEmpty() && permittedTenantIds.isEmpty()) {
            log.warn("User {} has no read permissions for any users or tenants", requesterId);
            return (_, _, cb) -> cb.disjunction(); // Always false - matches nothing
        }

        // If only user IDs have permissions
        if (permittedTenantIds.isEmpty()) {
            log.trace("User {} can read specific users only (count={})", requesterId, permittedUserIds.size());
            return (root, _, _) -> root.get("id").in(permittedUserIds);
        }

        // If only tenant IDs have permissions
        if (permittedUserIds.isEmpty()) {
            log.trace("User {} can read by tenant membership only (count={})", requesterId, permittedTenantIds.size());
            return (root, _, _) -> root.get("tenantId").in(permittedTenantIds);
        }

        // Both sets have values - use OR
        return Specification.anyOf(
                (root, _, _) -> root.get("id").in(permittedUserIds),
                (root, _, _) -> root.get("tenantId").in(permittedTenantIds)
        );
    }
}
