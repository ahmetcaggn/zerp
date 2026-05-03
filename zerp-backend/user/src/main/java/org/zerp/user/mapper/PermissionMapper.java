package org.zerp.user.mapper;

import org.mapstruct.Mapper;
import org.zerp.common.permission.entity.Permission;
import org.zerp.user.dto.permission.PermissionResponse;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    PermissionResponse toResponse(Permission permission);
}
