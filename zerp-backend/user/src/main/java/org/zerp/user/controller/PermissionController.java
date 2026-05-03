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

import java.util.List;

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
    ResponseEntity<ApiResponse<List<PermissionAction>>> getAllPermissions() {
        return ResponseEntity.ok(ApiResponse.success(service.getAllPermissions()));
    }
}
