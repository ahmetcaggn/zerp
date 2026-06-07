package org.zerp.user.permission;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.service.CommonPermissionService;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SystemMetricsPermissionEvaluator {
    private final CommonPermissionService commonPermissionService;

    public boolean canRead(UUID userId) {
        return commonPermissionService.hasRootPermission(userId, PermissionAction.READ_SYSTEM_METRICS)
                || commonPermissionService.hasRootPermission(userId, PermissionAction.ADMIN);
    }
}
