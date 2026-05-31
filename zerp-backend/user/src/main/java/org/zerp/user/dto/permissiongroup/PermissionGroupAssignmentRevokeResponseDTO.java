package org.zerp.user.dto.permissiongroup;

import lombok.Builder;
import lombok.Data;
import org.zerp.common.permission.entity.PermissionTargetType;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PermissionGroupAssignmentRevokeResponseDTO {
    private UUID assignmentId;
    private UUID groupId;
    private UUID userId;
    private PermissionTargetType targetType;
    private UUID targetId;
    private int requestedCount;
    private int removedLinkCount;
    private int deletedPermissionCount;
    private int retainedPermissionCount;
    private int missingPermissionCount;
    private List<String> warnings;
}
