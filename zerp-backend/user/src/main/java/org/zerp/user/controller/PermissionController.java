package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.user.dto.permission.PermissionCreateRequestDTO;
import org.zerp.user.dto.permission.PermissionResponse;
import org.zerp.user.dto.permission.PermissionUpdateRequest;
import org.zerp.user.service.PermissionService;

import org.zerp.common.permission.entity.PermissionTargetType;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/permissions")
@RequiredArgsConstructor
@Tag(name = "Permissions", description = "API for managing permissions")
public class PermissionController extends ResourceController<PermissionResponse, PermissionResponse, PermissionCreateRequestDTO, PermissionUpdateRequest, Long> {
    private final PermissionService service;

    @Override
    protected PermissionService getService() {
        return service;
    }

    @GetMapping("/actions")
    ResponseEntity<ApiResponse<Map<PermissionAction, List<PermissionTargetType>>>> getAllPermissions() {
        List<PermissionAction> actions = service.getAllPermissions();
        Map<PermissionAction, List<PermissionTargetType>> actionHierarchyMap = new EnumMap<>(PermissionAction.class);

        for (PermissionAction action : actions) {
            List<PermissionTargetType> hierarchy = new ArrayList<>();
            PermissionTargetType current = action.minTargetType;
            while (current != null) {
                hierarchy.add(current);
                current = current.parent;
            }
            actionHierarchyMap.put(action, hierarchy);
        }

        return ResponseEntity.ok(ApiResponse.success(actionHierarchyMap));
    }
}
