package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.menuitem.MenuItemCreateDTO;
import org.zerp.sale.dto.menuitem.MenuItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemUpdateDTO;
import org.zerp.sale.service.MenuItemService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/menu-items")
@RequiredArgsConstructor
@Tag(name = "MenuItem", description = "API for managing menu items (single product or combo) within a category")
public class MenuItemController extends
        ResourceController<MenuItemDTO, MenuItemDTO, MenuItemCreateDTO, MenuItemUpdateDTO, UUID> {
    private final MenuItemService service;

    @Override
    protected MenuItemService getService() {
        return service;
    }
}
