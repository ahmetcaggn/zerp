package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.permission.entity.Permission;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.user.service.PermissionService;

import java.util.List;

@RestController
@RequestMapping("/user/permissions")
@RequiredArgsConstructor
@Tag(name = "Permission", description = "API for managing permissions")
public class PermissionController extends ResourceController<Permission, Permission, Permission, Permission, Long> {
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
