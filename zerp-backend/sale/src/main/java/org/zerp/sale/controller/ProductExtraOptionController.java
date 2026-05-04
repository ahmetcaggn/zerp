package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionCreateDTO;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionDTO;
import org.zerp.sale.dto.productextraoption.ProductExtraOptionUpdateDTO;
import org.zerp.sale.service.ProductExtraOptionService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/product-extra-options")
@RequiredArgsConstructor
@Tag(name = "ProductExtraOption", description = "API for managing product extra options (e.g. extra 100g meat) which auto-deduct from theoretical stock")
public class ProductExtraOptionController extends
        ResourceController<ProductExtraOptionDTO, ProductExtraOptionDTO, ProductExtraOptionCreateDTO, ProductExtraOptionUpdateDTO, UUID> {
    private final ProductExtraOptionService service;

    @Override
    protected ProductExtraOptionService getService() {
        return service;
    }
}
