package org.zerp.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.zerp.common.permission.entity.Permission;
import org.zerp.user.dto.permission.PermissionCreateRequestDTO;
import org.zerp.user.dto.permission.PermissionResponse;
import org.zerp.user.dto.permission.PermissionUpdateRequest;
import org.zerp.user.permission.PermissionPermissionEvaluator;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    PermissionResponse toResponse(Permission permission);

    @Mapping(source = "id", target = "permissionId")
    @Mapping(source = "userId", target = "permissionUserId")
    PermissionPermissionEvaluator.PermissionTarget toTarget(Permission permission);

    @Mapping(source = "id", target = "permissionId")
    @Mapping(source = "data.userId", target = "permissionUserId")
    @Mapping(source = "data.targetType", target = "targetType")
    @Mapping(source = "data.targetId", target = "targetId")
    @Mapping(source = "data.action", target = "action")
    PermissionPermissionEvaluator.PermissionTarget toTarget(Long id, PermissionUpdateRequest data);

    @Mapping(source = "userId", target = "permissionUserId")
    PermissionPermissionEvaluator.PermissionDraft toDraft(PermissionCreateRequestDTO data);
}

