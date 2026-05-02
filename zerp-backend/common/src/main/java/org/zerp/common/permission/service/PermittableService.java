package org.zerp.common.permission.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermissionRepository;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class PermittableService {
    private final PermissionRepository permissionRepository;

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
