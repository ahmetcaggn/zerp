package org.zerp.user.dto.permissiongroup;

import lombok.Builder;
import lombok.Data;
import org.zerp.common.permission.entity.PermissionGroupScopeType;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.UUID;

@Data
@Builder
public class PermissionGroupAssignResponseDTO {
    private int requestedCount;
    private int createdCount;
    private int skippedCount;
    private PermissionGroupScopeType scopeType;
    private PermissionTargetType targetType;
    private UUID targetId;
}
