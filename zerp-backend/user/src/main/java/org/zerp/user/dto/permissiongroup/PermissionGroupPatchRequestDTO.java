package org.zerp.user.dto.permissiongroup;

import lombok.Data;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionGroupScopeType;

import java.util.Set;

@Data
public class PermissionGroupPatchRequestDTO {
    private String name;
    private String description;
    private PermissionGroupScopeType scopeType;
    private Set<PermissionAction> actions;
}
