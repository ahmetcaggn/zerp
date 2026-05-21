package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.menuitem.MenuItemCreateDTO;
import org.zerp.sale.dto.menuitem.MenuItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemImageUploadResponseDTO;
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

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemImageUploadResponseDTO> uploadMenuItemImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("categoryId") UUID categoryId
    ) {
        return ResponseEntity.ok(service.uploadMenuItemImage(file, categoryId));
    }
}
