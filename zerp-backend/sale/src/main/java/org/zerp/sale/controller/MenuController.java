package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.menu.MenuCreateDTO;
import org.zerp.sale.dto.menu.MenuDTO;
import org.zerp.sale.dto.menu.MenuUpdateDTO;
import org.zerp.sale.service.MenuService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/menus")
@RequiredArgsConstructor
@Tag(name = "Menu", description = "API for managing menus that group categories and items for a shop")
public class MenuController extends
        ResourceController<MenuDTO, MenuDTO, MenuCreateDTO, MenuUpdateDTO, UUID> {
    private final MenuService service;

    @Override
    protected MenuService getService() {
        return service;
    }
}
