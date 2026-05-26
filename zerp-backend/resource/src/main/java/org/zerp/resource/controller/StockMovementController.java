package org.zerp.resource.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.resource.dto.stockmovement.StockMovementCreateDTO;
import org.zerp.resource.dto.stockmovement.StockMovementDTO;
import org.zerp.resource.dto.stockmovement.StockMovementTimelineDTO;
import org.zerp.resource.service.StockMovementService;

import java.time.LocalDateTime;
import java.util.List;
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

    @GetMapping("/timeline")
    public ResponseEntity<ApiResponse<StockMovementTimelineDTO>> timeline(
            @RequestParam UUID shopId,
            @RequestParam(required = false) UUID stockResourceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "WEEK") String bucket
    ) {
        return ResponseEntity.ok(buildResponse(service.getTimeline(shopId, stockResourceId, from, to, bucket)));
    }

    @GetMapping("/drill-down")
    public ResponseEntity<ApiResponse<List<StockMovementDTO>>> drillDown(
            @RequestParam UUID shopId,
            @RequestParam(required = false) UUID stockResourceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "250") Integer limit
    ) {
        return ResponseEntity.ok(buildResponse(service.getDrillDownMovements(shopId, stockResourceId, from, to, limit)));
    }
}
