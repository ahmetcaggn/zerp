package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.permission.entity.PredefinedPermissionGroupCode;
import org.zerp.user.dto.permissiongroup.PermissionGroupAssignRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupAssignResponseDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupCreateRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupPatchRequestDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupResponseDTO;
import org.zerp.user.dto.permissiongroup.PermissionGroupUpdateRequestDTO;
import org.zerp.user.service.PermissionGroupService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/permission-groups")
@RequiredArgsConstructor
@Tag(name = "Permission Groups", description = "Permission group templates and tenant custom groups")
public class PermissionGroupController {
    private final PermissionGroupService permissionGroupService;

    @GetMapping("/predefined")
    public ResponseEntity<ApiResponse<List<PermissionGroupResponseDTO>>> getPredefinedGroups() {
        return ResponseEntity.ok(ApiResponse.success(permissionGroupService.getPredefinedGroups()));
    }

    @GetMapping("/predefined/{code}")
    public ResponseEntity<ApiResponse<PermissionGroupResponseDTO>> getPredefinedGroup(@PathVariable PredefinedPermissionGroupCode code) {
        return ResponseEntity.ok(ApiResponse.success(permissionGroupService.getPredefinedGroup(code)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PermissionGroupResponseDTO>>> getCustomGroups() {
        return ResponseEntity.ok(ApiResponse.success(permissionGroupService.getCustomGroups()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PermissionGroupResponseDTO>> getCustomGroup(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(permissionGroupService.getCustomGroup(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PermissionGroupResponseDTO>> createCustomGroup(
            @Valid @RequestBody PermissionGroupCreateRequestDTO request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(permissionGroupService.createCustomGroup(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PermissionGroupResponseDTO>> updateCustomGroup(
            @PathVariable UUID id,
            @Valid @RequestBody PermissionGroupUpdateRequestDTO request
    ) {
        return ResponseEntity.ok(ApiResponse.success(permissionGroupService.updateCustomGroup(id, request)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<PermissionGroupResponseDTO>> patchCustomGroup(
            @PathVariable UUID id,
            @RequestBody PermissionGroupPatchRequestDTO request
    ) {
        return ResponseEntity.ok(ApiResponse.success(permissionGroupService.patchCustomGroup(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomGroup(@PathVariable UUID id) {
        permissionGroupService.deleteCustomGroup(id);
        return ResponseEntity.ok(ApiResponse.noContent());
    }

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<PermissionGroupAssignResponseDTO>> assignGroup(
            @RequestBody PermissionGroupAssignRequestDTO request
    ) {
        return ResponseEntity.ok(ApiResponse.success(permissionGroupService.assignGroup(request)));
    }
}
