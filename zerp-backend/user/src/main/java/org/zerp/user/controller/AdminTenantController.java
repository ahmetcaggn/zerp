package org.zerp.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.user.dto.tenant.TenantCreateRequestDTO;
import org.zerp.user.dto.tenant.TenantNameCheckResponseDTO;
import org.zerp.user.dto.tenant.TenantResponseDTO;
import org.zerp.user.dto.tenant.TenantUpdateRequestDTO;
import org.zerp.user.service.AdminTenantService;

import java.util.UUID;

@RequestMapping("/user/tenants")
@RestController
@RequiredArgsConstructor
@Tag(name = "Admin Tenants", description = "API for managing tenant resources in admin panel")
public class AdminTenantController extends ResourceController<
        TenantResponseDTO,
        TenantResponseDTO,
        TenantCreateRequestDTO,
        TenantUpdateRequestDTO,
        UUID> {
    private final AdminTenantService service;

    @Override
    protected IResourceService<TenantResponseDTO, TenantResponseDTO, TenantCreateRequestDTO, TenantUpdateRequestDTO, UUID> getService() {
        return service;
    }

    @GetMapping("/check-name")
    ResponseEntity<ApiResponse<TenantNameCheckResponseDTO>> checkTenantName(
            @RequestParam(name = "name") String name
    ) {
        return ResponseEntity.ok(buildResponse(service.isTenantNameAvailable(name)));
    }

}
