package org.zerp.resource.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.resource.dto.stockcount.StockCountCreateDTO;
import org.zerp.resource.dto.stockcount.StockCountDTO;
import org.zerp.resource.dto.stockcount.StockCountUpdateDTO;
import org.zerp.resource.service.StockCountService;

import java.util.UUID;

@RestController
@RequestMapping("/resource/stock-counts")
@RequiredArgsConstructor
@Tag(name = "StockCount", description = "API for physical inventory count sessions. Creates sessions with theoretical quantities and allows owners to record actual counts.")
public class StockCountController extends
        ResourceController<StockCountDTO, StockCountDTO, StockCountCreateDTO, StockCountUpdateDTO, UUID> {
    private final StockCountService service;

    @Override
    protected StockCountService getService() {
        return service;
    }
}
