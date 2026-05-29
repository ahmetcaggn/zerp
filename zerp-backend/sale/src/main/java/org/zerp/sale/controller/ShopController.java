package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.user.ImageSize;
import org.zerp.sale.dto.shop.ShopImageUploadResponseDTO;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.shop.ShopDTO;
import org.zerp.sale.dto.shopdashboard.ShopDashboardOverviewDTO;
import org.zerp.sale.service.ShopDashboardService;
import org.zerp.sale.service.ShopService;

import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/sale/shops")
@RequiredArgsConstructor
@Tag(name = "Shop", description = "API for listing tenant shops and updating shop sale settings")
public class ShopController extends ResourceController<ShopDTO, ShopDTO, Void, Void, UUID> {
    private final ShopService service;
    private final ShopDashboardService shopDashboardService;

    @Override
    protected ShopService getService() {
        return service;
    }

    @GetMapping("/{shopId}/dashboard-overview")
    public ShopDashboardOverviewDTO getDashboardOverview(@PathVariable UUID shopId) {
        return shopDashboardService.getOverview(shopId);
    }

    @PostMapping(value = "/{shopId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ShopImageUploadResponseDTO> uploadShopImage(
            @PathVariable UUID shopId,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(service.uploadShopImage(shopId, file));
    }

    @GetMapping("/{shopId}/image")
    public ResponseEntity<Resource> getShopImage(
            @PathVariable UUID shopId,
            @RequestParam(name = "size", required = false) String size
    ) {
        var response = service.getShopImage(shopId, resolveImageSize(size));
        MediaType contentType = response.contentType() != null
                ? response.contentType()
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(contentType)
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
                .body(response.resource());
    }

    private ImageSize resolveImageSize(String size) {
        if (size == null || size.isBlank()) {
            return ImageSize.SMALL;
        }
        try {
            return ImageSize.valueOf(size.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image size: " + size);
        }
    }
}
