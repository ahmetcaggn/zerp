package org.zerp.sale.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.sale.dto.tableorder.PublicCartOrderPreviewDTO;
import org.zerp.sale.dto.tableorder.TableOrderCreateDTO;
import org.zerp.sale.dto.tableorder.TableOrderDTO;
import org.zerp.sale.dto.tableorder.TableOrderUpdateDTO;
import org.zerp.sale.service.TableOrderService;

import java.util.UUID;

@RestController
@RequestMapping("/sale/table-orders")
@RequiredArgsConstructor
@Tag(name = "TableOrder", description = "API for managing orders on shop tables")
public class TableOrderController extends
        ResourceController<TableOrderDTO, TableOrderDTO, TableOrderCreateDTO, TableOrderUpdateDTO, UUID> {

    private final TableOrderService service;

    @Override
    protected TableOrderService getService() {
        return service;
    }

    @GetMapping("/public-cart-orders/preview")
    public PublicCartOrderPreviewDTO previewPublicCartOrder(
            @RequestParam String code,
            @RequestParam UUID tableId
    ) {
        return service.previewPublicCartOrder(code, tableId);
    }
}
