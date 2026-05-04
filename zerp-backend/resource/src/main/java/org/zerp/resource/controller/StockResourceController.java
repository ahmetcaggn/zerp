package org.zerp.resource.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.resource.dto.resource.StockResourceCreateDTO;
import org.zerp.resource.dto.resource.StockResourceDTO;
import org.zerp.resource.dto.resource.StockResourceUpdateDTO;
import org.zerp.resource.service.StockResourceService;

import java.util.UUID;

@RestController
@RequestMapping("/resource/stock-resources")
@RequiredArgsConstructor
@Tag(name = "StockResource", description = "API for managing stock resources with quantity tracking and unit types")
public class StockResourceController extends
        ResourceController<StockResourceDTO, StockResourceDTO, StockResourceCreateDTO, StockResourceUpdateDTO, UUID> {
    private final StockResourceService service;

    @Override
    protected StockResourceService getService() {
        return service;
    }
}
