package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.product.ProductCreateDTO;
import org.zerp.sale.dto.product.ProductDTO;
import org.zerp.sale.dto.product.ProductUpdateDTO;
import org.zerp.sale.service.ProductService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/products")
@RequiredArgsConstructor
@Tag(name = "Product", description = "API for managing cafe/restaurant products and recipes")
public class ProductController extends
        ResourceController<ProductDTO, ProductDTO, ProductCreateDTO, ProductUpdateDTO, UUID> {
    private final ProductService service;

    @Override
    protected ProductService getService() {
        return service;
    }
}
