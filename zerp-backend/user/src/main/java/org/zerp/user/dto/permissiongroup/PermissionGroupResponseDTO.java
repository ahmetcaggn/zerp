package org.zerp.user.dto.permissiongroup;

import lombok.Builder;
import lombok.Data;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionGroupScopeType;
import org.zerp.common.permission.entity.PredefinedPermissionGroupCode;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PermissionGroupResponseDTO {
    private String source;
    private UUID id;
    private PredefinedPermissionGroupCode code;
    private String name;
    private String description;
    private PermissionGroupScopeType scopeType;
    private List<PermissionAction> actions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
