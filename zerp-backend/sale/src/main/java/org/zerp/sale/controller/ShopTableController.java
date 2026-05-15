package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.shoptable.ShopTableCreateDTO;
import org.zerp.sale.dto.shoptable.ShopTableDTO;
import org.zerp.sale.dto.shoptable.ShopTableUpdateDTO;
import org.zerp.sale.service.ShopTableService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/tables")
@RequiredArgsConstructor
@Tag(name = "ShopTable", description = "API for managing tables in a shop (cafe/restaurant)")
public class ShopTableController extends
        ResourceController<ShopTableDTO, ShopTableDTO, ShopTableCreateDTO, ShopTableUpdateDTO, UUID> {

    private final ShopTableService service;

    @Override
    protected ShopTableService getService() {
        return service;
    }
}
