package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.shop.ShopDTO;
import org.zerp.sale.service.ShopService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/shops")
@RequiredArgsConstructor
@Tag(name = "Shop", description = "Read-only API for listing tenant shops")
public class ShopController extends ResourceController<ShopDTO, ShopDTO, Void, Void, UUID> {
    private final ShopService service;

    @Override
    protected ShopService getService() {
        return service;
    }
}
