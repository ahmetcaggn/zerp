package org.zerp.user.permission;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.user.repository.UserRepository;

import java.util.UUID;

@Log4j2
@Component
@RequiredArgsConstructor
public class PermissionPermissionEvaluator {

    private final PermissionRepository permissionRepository;
    private final CurrentTenantIdResolver tenantIdResolver;
    private final UserRepository userRepository;

    public boolean canRead(UUID userId, Permission target) {
        log.debug("Checking if user {} can read permission {} for user {}",
                userId, target.getId(), target.getUserId());

        UUID tenantId = tenantIdResolver.resolve();
        return isAdminTenant(userId, tenantId) ||
                hasReadPermissionOnUser(userId, target.getUserId());
    }

    public boolean canCreate(UUID userId, Permission target) {
        log.debug("Checking if user {} can create permission for user {}",
                userId, target.getUserId());
        return canWrite(userId, target.getUserId());
    }

    public boolean canUpdate(UUID userId, Permission target) {
        log.debug("Checking if user {} can update permission {} for user {}",
                userId, target.getId(), target.getUserId());
        return canWrite(userId, target.getUserId());
    }

    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    public boolean canPatch(UUID userId, Permission target) {
        log.debug("Checking if user {} can patch permission {} for user {}",
                userId, target.getId(), target.getUserId());
        return canWrite(userId, target.getUserId());
    }

    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    public boolean canDelete(UUID userId, Permission target) {
        log.debug("Checking if user {} can delete permission {} for user {}",
                userId, target.getId(), target.getUserId());
        return canWrite(userId, target.getUserId());
    }

    @NonNull
    public Specification<Permission> filterRead(UUID userId) {
        if (isAdminTenant(userId, tenantIdResolver.resolve())) {
            log.debug("user {} is admin tenant and can read all permissions", userId);
            return Specification.unrestricted();
        }

        var readableUserIds = permissionRepository.findTargetIdsByUserAndTargetTypeAndAction(
                userId,
                PermissionTargetType.USER,
                PermissionAction.READ_PERMISSION
        );

        log.debug("user {} can read permissions for {} users via READ_PERMISSION or ADMIN_TENANT",
                userId, readableUserIds.size());

        if (readableUserIds.isEmpty()) {
            return (_, _, cb) -> cb.disjunction();
        }

        return (root, _, _) -> root.get("userId").in(readableUserIds);
    }

    public boolean canReadPermissionActions(UUID userId) {
        return isAdminTenant(userId, tenantIdResolver.resolve());
    }

    private boolean canWrite(UUID userId, UUID targetUserId) {
        UUID tenantId = tenantIdResolver.resolve();
        if (tenantId == null) {
            log.error("Cannot evaluate permission for user {} because tenant ID is not resolved", userId);
            return false;
        }

        AppUser targetUser = userRepository.findById(targetUserId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Target user not found"));

        return targetUser.getTenantId().equals(tenantIdResolver.resolve()) &&
                isAdminTenant(userId, tenantId);
    }

    private boolean isAdminTenant(UUID userId, UUID tenantId) {
        return permissionRepository.findTargetIdsByUserAndTargetTypeAndAction(
                userId,
                PermissionTargetType.TENANT,
                PermissionAction.ADMIN_TENANT
        ).contains(tenantId);
    }

    private boolean hasReadPermissionOnUser(UUID requesterId, UUID permissionUserId) {
        return permissionRepository.findTargetIdsByUserAndTargetTypeAndAction(
                requesterId,
                PermissionTargetType.USER,
                PermissionAction.READ_PERMISSION
        ).contains(permissionUserId);
    }
}
