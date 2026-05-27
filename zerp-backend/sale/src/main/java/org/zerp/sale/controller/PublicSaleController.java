package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.context.RequestContext;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.dto.user.ImageSize;
import org.zerp.common.entity.sale.MenuLanguage;
import org.zerp.sale.dto.publicsale.PublicCartOrderCreateRequest;
import org.zerp.sale.dto.publicsale.PublicCartOrderCreateResponse;
import org.zerp.sale.dto.publicsale.PublicImageContentResponse;
import org.zerp.sale.dto.publicsale.PublicMenuItemDTO;
import org.zerp.sale.dto.publicsale.PublicShopDTO;
import org.zerp.sale.dto.publicsale.PublicShopMenuResponseDTO;
import org.zerp.sale.service.PublicSaleService;

import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/sale/public")
@RequiredArgsConstructor
@Tag(name = "PublicSale", description = "Public API for zerp-client shop and menu views")
public class PublicSaleController {
    private final PublicSaleService publicSaleService;

    @Value("${app.version:0.0.1-SNAPSHOT}")
    private String appVersion;

    @GetMapping("/shops")
    public ResponseEntity<ApiResponse<List<PublicShopDTO>>> getShops() {
        return ResponseEntity.ok(buildResponse(publicSaleService.listShops()));
    }

    @GetMapping("/shops/nearby")
    public ResponseEntity<ApiResponse<List<PublicShopDTO>>> getNearbyShops(
            @RequestParam(name = "lat") double latitude,
            @RequestParam(name = "lng") double longitude,
            @RequestParam(name = "_start", defaultValue = "0") int start,
            @RequestParam(name = "_end", required = false) Integer end,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        int resolvedEnd = end != null ? end : start + limit;
        if (start < 0 || resolvedEnd <= start) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination range");
        }

        Page<PublicShopDTO> page = publicSaleService.listNearbyShops(latitude, longitude, start, resolvedEnd);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Total-Count");

        return new ResponseEntity<>(buildResponse(page.getContent()), headers, HttpStatus.OK);
    }

    @GetMapping("/shops/{shopId}/menu")
    public ResponseEntity<ApiResponse<PublicShopMenuResponseDTO>> getActiveMenu(
            @PathVariable UUID shopId,
            @RequestParam(name = "language", required = false) MenuLanguage language
    ) {
        return ResponseEntity.ok(buildResponse(publicSaleService.getActiveMenuWithCategories(shopId, language)));
    }

    @GetMapping("/shops/{shopId}/categories/{categoryId}/menu-items")
    public ResponseEntity<ApiResponse<List<PublicMenuItemDTO>>> getCategoryMenuItems(
            @PathVariable UUID shopId,
            @PathVariable UUID categoryId,
            @RequestParam(name = "language", required = false) MenuLanguage language,
            @RequestParam(name = "_start", defaultValue = "0") int start,
            @RequestParam(name = "_end", defaultValue = "20") int end,
            @RequestParam(name = "_sort", defaultValue = "name") String sort,
            @RequestParam(name = "_order", defaultValue = "ASC") String order
    ) {
        if (start < 0 || end <= start) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination range");
        }

        int pageSize = end - start;
        int pageNumber = start / pageSize;
        Sort direction = Sort.by(Sort.Direction.fromString(order), sort);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, direction);

        Page<PublicMenuItemDTO> page = publicSaleService.getMenuItemsByCategory(shopId, categoryId, pageable, language);
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Total-Count");
        return new ResponseEntity<>(buildResponse(page.getContent()), headers, HttpStatus.OK);
    }

    @PostMapping("/shops/{shopId}/cart-orders")
    public ResponseEntity<ApiResponse<PublicCartOrderCreateResponse>> createCartOrder(
            @PathVariable UUID shopId,
            @RequestBody PublicCartOrderCreateRequest request
    ) {
        PublicCartOrderCreateResponse response = publicSaleService.createPublicCartOrder(shopId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(buildResponse(response));
    }

    @GetMapping("/images/{imageId}")
    public ResponseEntity<Resource> getMenuItemImage(
            @PathVariable String imageId,
            @RequestParam(name = "size", required = false) String size
    ) {
        PublicImageContentResponse response = publicSaleService.getMenuItemImage(imageId, resolveImageSize(size));
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

    private <T> ApiResponse<T> buildResponse(T data) {
        Long durationMs = RequestContext.endTiming();
        return ApiResponse.success(data)
                .withDurationMs(durationMs)
                .withVersion(appVersion);
    }
}
