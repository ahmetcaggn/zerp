package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.context.RequestContext;
import org.zerp.common.dto.ApiResponse;
import org.zerp.sale.dto.publicsale.PublicProductDTO;
import org.zerp.sale.dto.publicsale.PublicShopDTO;
import org.zerp.sale.dto.publicsale.PublicShopMenuResponseDTO;
import org.zerp.sale.service.PublicSaleService;

import java.util.List;
import java.util.UUID;

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

    @GetMapping("/shops/{shopId}/menu")
    public ResponseEntity<ApiResponse<PublicShopMenuResponseDTO>> getActiveMenu(@PathVariable UUID shopId) {
        return ResponseEntity.ok(buildResponse(publicSaleService.getActiveMenuWithCategories(shopId)));
    }

    @GetMapping("/shops/{shopId}/categories/{categoryId}/products")
    public ResponseEntity<ApiResponse<List<PublicProductDTO>>> getCategoryProducts(
            @PathVariable UUID shopId,
            @PathVariable UUID categoryId,
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

        Page<PublicProductDTO> page = publicSaleService.getProductsByCategory(shopId, categoryId, pageable);
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Total-Count");
        return new ResponseEntity<>(buildResponse(page.getContent()), headers, HttpStatus.OK);
    }

    private <T> ApiResponse<T> buildResponse(T data) {
        Long durationMs = RequestContext.endTiming();
        return ApiResponse.success(data)
                .withDurationMs(durationMs)
                .withVersion(appVersion);
    }
}
