package org.zerp.common.permission.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;
import org.zerp.common.util.header.CurrentTenantIdResolver;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class CommonPermissionService {
    private final PermissionRepository permissionRepository;
    private final CurrentTenantIdResolver currentTenantIdResolver;

    public UUID getTenantIdIfTheUserIsAdminOnIt(UUID userId) {
        log.trace("Checking if user {} is admin on any tenant", userId);
        UUID tenantId = currentTenantIdResolver.resolve();
        boolean isAdmin = permissionRepository.existsAdminByUserIdAndTenantId(userId, tenantId);
        if (isAdmin) {
            log.trace("User {} is admin on tenant {}, returning tenantId", userId, tenantId);
            return tenantId;
        }
        log.trace("User {} is not admin on tenant {}, returning null", userId, tenantId);
        return null;
    }

    public boolean isAdminOnTenant(UUID userId, UUID tenantId) {
        log.trace("Checking if user {} is admin on tenant {}", userId, tenantId);
        boolean isAdmin = permissionRepository.existsAdminByUserIdAndTenantId(userId, tenantId);
        log.trace("isAdmin check for user {} on tenant {}: {}", userId, tenantId, isAdmin);
        return isAdmin;
    }

    public boolean isAdminOnTenantRoot(UUID userId) {
        log.trace("Checking if user {} is system admin on tenant root", userId);
        boolean isSystemAdmin = permissionRepository.existsAdminByUserIdOnTenantRoot(userId);
        log.trace("isAdmin check for user {} on tenant root: {}", userId, isSystemAdmin);
        return isSystemAdmin;
    }

    public boolean isAdminAny(UUID userId, UUID tenantId) {
        log.trace("Checking if tenant {} is admin", tenantId);
        boolean isSystemAdmin = permissionRepository.existsAdminByUserIdOnTenantRoot(userId);
        boolean isAdmin = permissionRepository.existsAdminByUserIdAndTenantId(userId, tenantId);
        log.trace("isAdmin check for user {} on tenant {}: isSystemAdmin={}, isAdmin={}",
                userId, tenantId, isSystemAdmin, isAdmin);
        return isSystemAdmin || isAdmin;
    }

    public boolean hasRootPermission(UUID userId, PermissionAction action) {
        log.trace("Checking root permission for userId: {}, action: {}", userId, action);
        boolean hasRootPermission = !permissionRepository.findAllByUserAndTenantRootPermission(
                userId, action).isEmpty();
        log.trace("Root permission check result for user {} and action {}: {}",
                userId, action, hasRootPermission);
        return hasRootPermission;
    }

    public Set<UUID> getAllPermitted(UUID userId, PermissionTargetType type, PermissionAction action) {
        log.trace("getAllPermitted: user={}, type={}, action={}", userId, type, action);
        Set<UUID> result = new HashSet<>(permissionRepository
                .findTargetIdsByUserAndTargetTypeAndAction(userId, type, action));
        log.trace("getAllPermitted result size: {}", result.size());
        return result;
    }
}
