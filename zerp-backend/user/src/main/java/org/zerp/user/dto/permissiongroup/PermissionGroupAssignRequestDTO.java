package org.zerp.user.dto.permissiongroup;

import lombok.Data;
import org.zerp.common.permission.entity.PredefinedPermissionGroupCode;

import java.util.UUID;

@Data
public class PermissionGroupAssignRequestDTO {
    private UUID userId;
    private UUID groupId;
    private PredefinedPermissionGroupCode predefinedCode;
    private UUID scopeTargetId;
}
