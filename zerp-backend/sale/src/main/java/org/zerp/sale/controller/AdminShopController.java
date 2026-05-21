package org.zerp.sale.controller;

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
import org.zerp.sale.dto.adminshop.AdminShopCreateRequestDTO;
import org.zerp.sale.dto.adminshop.AdminShopNameCheckResponseDTO;
import org.zerp.sale.dto.adminshop.AdminShopResponseDTO;
import org.zerp.sale.dto.adminshop.AdminShopUpdateRequestDTO;
import org.zerp.sale.service.AdminShopService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/admin/shops")
@RequiredArgsConstructor
@Tag(name = "Admin Shops", description = "API for managing shop resources in admin panel")
public class AdminShopController extends ResourceController<
        AdminShopResponseDTO,
        AdminShopResponseDTO,
        AdminShopCreateRequestDTO,
        AdminShopUpdateRequestDTO,
        UUID> {
    private final AdminShopService service;

    @Override
    protected IResourceService<
            AdminShopResponseDTO,
            AdminShopResponseDTO,
            AdminShopCreateRequestDTO,
            AdminShopUpdateRequestDTO,
            UUID> getService() {
        return service;
    }

    @GetMapping("/check-name")
    ResponseEntity<ApiResponse<AdminShopNameCheckResponseDTO>> checkShopName(
            @RequestParam(name = "tenantId") UUID tenantId,
            @RequestParam(name = "name") String name,
            @RequestParam(name = "shopId", required = false) UUID shopId
    ) {
        return ResponseEntity.ok(buildResponse(service.isShopNameAvailable(tenantId, name, shopId)));
    }
}
