package org.zerp.user.dto.permissiongroup;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.permission.entity.PermissionGroupScopeType;

import java.util.Set;

@Data
public class PermissionGroupUpdateRequestDTO {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private PermissionGroupScopeType scopeType;

    @NotEmpty
    private Set<PermissionAction> actions;
}
