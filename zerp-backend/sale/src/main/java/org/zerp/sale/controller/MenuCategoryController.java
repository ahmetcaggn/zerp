package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.menucategory.MenuCategoryCreateDTO;
import org.zerp.sale.dto.menucategory.MenuCategoryDTO;
import org.zerp.sale.dto.menucategory.MenuCategoryUpdateDTO;
import org.zerp.sale.service.MenuCategoryService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/menu-categories")
@RequiredArgsConstructor
@Tag(name = "MenuCategory", description = "API for managing menu categories that group menu items")
public class MenuCategoryController extends
        ResourceController<MenuCategoryDTO, MenuCategoryDTO, MenuCategoryCreateDTO, MenuCategoryUpdateDTO, UUID> {
    private final MenuCategoryService service;

    @Override
    protected MenuCategoryService getService() {
        return service;
    }
}
