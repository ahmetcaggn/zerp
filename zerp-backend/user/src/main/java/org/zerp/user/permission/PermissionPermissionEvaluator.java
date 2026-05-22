package org.zerp.user.permission;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.TenantRoot;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.permission.repository.PermittableRepository;
import org.zerp.common.permission.service.CommonPermissionService;
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
    private final PermittableRepository permittableRepository;
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId, Permission target) {
        log.debug("Checking if user {} can read permission {} for user {}",
                userId, target.getId(), target.getUserId());

        if (target.getUserId() == null) {
            log.warn("Permission {} has null userId", target.getId());
            return false;
        }
        AppUser user = userRepository.findById(target.getUserId()).orElse(null);
        if (user == null) return false;

        return isOwnPermission(userId, target) ||
                isAdminTenant(userId, user.getTenantId()) ||
                hasReadPermissionOnUser(userId, target.getUserId());
    }

    public boolean canCreate(UUID userId, Permission target) {
        log.debug("Checking if user {} can create permission for user {}",
                userId, target.getUserId());
        return canWrite(userId, target);
    }

    public boolean canUpdate(UUID userId, Permission target) {
        log.debug("Checking if user {} can update permission {} for user {}",
                userId, target.getId(), target.getUserId());
        return canWrite(userId, target);
    }

    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    public boolean canPatch(UUID userId, Permission target) {
        log.debug("Checking if user {} can patch permission {} for user {}",
                userId, target.getId(), target.getUserId());
        return canWrite(userId, target);
    }

    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    public boolean canDelete(UUID userId, Permission target) {
        log.debug("Checking if user {} can delete permission {} for user {}",
                userId, target.getId(), target.getUserId());
        return canWrite(userId, target);
    }

    @NonNull
    public Specification<Permission> filterRead(UUID userId) {
        if (isAdminTenantOnRoot(userId)) {
            log.debug("user {} is root admin tenant and can read all permissions", userId);
            return Specification.unrestricted();
        }

        var readableUserIds = permissionRepository.findTargetIdsByUserAndTargetTypeAndAction(
                userId,
                PermissionTargetType.USER,
                PermissionAction.READ_PERMISSION
        );
        var readableTenantIds = permissionRepository.findTargetIdsByUserAndTargetTypeAndAction(
                userId,
                PermissionTargetType.TENANT,
                PermissionAction.ADMIN
        );

        log.debug("user {} can read permissions for {} users via READ_PERMISSION",
                userId, readableUserIds.size());

        // Users can always read their own permissions
        Specification<Permission> ownPermissions = (root, _, cb) ->
                cb.equal(root.get("userId"), userId);

        if (readableUserIds.isEmpty() && readableTenantIds.isEmpty()) {
            return ownPermissions;
        }

        Specification<Permission> grantedPermissions = (root, _, _) ->
                root.get("userId").in(readableUserIds);
        Specification<Permission> grantedTenantPermissions = (root, _, _) ->
                root.get("user").get("tenantId").in(readableTenantIds);

        return Specification.anyOf(ownPermissions, grantedPermissions, grantedTenantPermissions);
    }

    public boolean canReadPermissionActions(UUID userId) {
        return isAdminTenant(userId, tenantIdResolver.resolve()) || isAdminTenantOnRoot(userId);
    }

    private boolean canWrite(UUID userId, Permission target) {
        AppUser targetUser = userRepository.findById(target.getUserId()).orElse(null);

        if (targetUser == null) {
            log.warn("Target user {} not found", target.getUserId());
            return false;
        }

        UUID targetUserTenantId = targetUser.getTenantId();

        boolean hasRootAdmin = isAdminTenantOnRoot(userId);
        boolean hasTenantAdmin = isAdminTenant(userId, targetUserTenantId);

        if (!hasRootAdmin && !hasTenantAdmin) {
            log.warn("User {} is neither root admin nor tenant admin for tenant {}", userId, targetUserTenantId);
            return false;
        }

        return switch (target.getTargetType()) {
            case TENANT_ROOT -> hasRootAdmin;
            case TENANT -> hasRootAdmin || target.getTargetId().equals(targetUserTenantId);
            default -> {
                if (hasRootAdmin) {
                    yield true;
                }

                UUID resourceTenantId = permittableRepository
                        .findTenantIdByIdAndTargetType(target.getTargetId(), target.getTargetType())
                        .orElse(null);

                if (resourceTenantId == null) {
                    log.warn("Failed to resolve tenant ID for target id {} of type {}",
                            target.getTargetId(), target.getTargetType());
                    yield false;
                }

                if (resourceTenantId.equals(TenantRoot.ID)) {
                    // return false because root tenant resources should not be manageable by tenant admins
                    log.warn("User {} is tenant admin for {} but tried to define permission over " +
                            "root tenant resource {}", userId, targetUserTenantId, target.getTargetId());
                    yield false;
                }

                if (!resourceTenantId.equals(targetUserTenantId)) {
                    log.warn("User {} is tenant admin for {} but tried to define permission over resource {} of another tenant {}",
                            userId, targetUserTenantId, target.getTargetId(), resourceTenantId);
                    yield false;
                }

                yield true;
            }
        };
    }

    private boolean isAdminTenantOnRoot(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.ADMIN);
    }

    private boolean isAdminTenant(UUID userId, UUID tenantId) {
        return permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                userId,
                PermissionTargetType.TENANT,
                PermissionAction.ADMIN,
                tenantId
        );
    }

    private boolean hasReadPermissionOnUser(UUID requesterId, UUID permissionUserId) {
        return permissionRepository.existsByUserAndTargetTypeAndActionAndTargetId(
                requesterId,
                PermissionTargetType.USER,
                PermissionAction.READ_PERMISSION,
                permissionUserId
        );
    }

    private boolean isOwnPermission(UUID requesterId, Permission permission) {
        return requesterId.equals(permission.getUserId());
    }
}
