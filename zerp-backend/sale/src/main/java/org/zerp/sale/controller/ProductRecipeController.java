package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.productrecipe.ProductRecipeCreateDTO;
import org.zerp.sale.dto.productrecipe.ProductRecipeDTO;
import org.zerp.sale.dto.productrecipe.ProductRecipeUpdateDTO;
import org.zerp.sale.service.ProductRecipeService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/product-recipes")
@RequiredArgsConstructor
@Tag(name = "ProductRecipe", description = "API for managing product recipes that define ingredient consumption for theoretical stock deduction")
public class ProductRecipeController extends
        ResourceController<ProductRecipeDTO, ProductRecipeDTO, ProductRecipeCreateDTO, ProductRecipeUpdateDTO, UUID> {
    private final ProductRecipeService service;

    @Override
    protected ProductRecipeService getService() {
        return service;
    }
}
