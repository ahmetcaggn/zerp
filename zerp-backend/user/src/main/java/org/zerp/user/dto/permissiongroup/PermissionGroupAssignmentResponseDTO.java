package org.zerp.user.dto.permissiongroup;

import lombok.Builder;
import lombok.Data;
import org.zerp.common.permission.entity.PermissionGroupScopeType;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PredefinedPermissionGroupCode;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PermissionGroupAssignmentResponseDTO {
    private UUID id;
    private UUID groupId;
    private String groupName;
    private String groupSource;
    private PredefinedPermissionGroupCode groupCode;
    private PermissionGroupScopeType groupScopeType;
    private UUID userId;
    private PermissionTargetType targetType;
    private UUID targetId;
    private LocalDateTime assignedAt;
}
