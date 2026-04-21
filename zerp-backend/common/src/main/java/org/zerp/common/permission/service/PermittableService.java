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

    public Set<UUID> getAllPermitted(Long employeeId, PermissionTargetType type, PermissionAction action) {
        log.trace("getAllPermitted: employee={}, type={}, action={}", employeeId, type, action);
        Set<UUID> result = new HashSet<>(permissionRepository
                .findTargetIdsByUserAndTargetTypeAndAction(employeeId, type, action));
        log.trace("getAllPermitted result size: {}", result.size());
        return result;
    }
}
