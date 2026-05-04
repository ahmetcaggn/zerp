package org.zerp.resource.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.resource.dto.stockmovement.StockMovementCreateDTO;
import org.zerp.resource.dto.stockmovement.StockMovementDTO;
import org.zerp.resource.service.StockMovementService;

import java.util.UUID;

@RestController
@RequestMapping("/resource/stock-movements")
@RequiredArgsConstructor
@Tag(name = "StockMovement", description = "API for recording and viewing stock movements (purchase, sale, waste, adjustment)")
public class StockMovementController extends
        ResourceController<StockMovementDTO, StockMovementDTO, StockMovementCreateDTO, StockMovementCreateDTO, UUID> {
    private final StockMovementService service;

    @Override
    protected StockMovementService getService() {
        return service;
    }
}
