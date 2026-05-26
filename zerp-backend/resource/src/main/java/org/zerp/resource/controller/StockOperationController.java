package org.zerp.resource.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.entity.resource.StockOperationType;
import org.zerp.resource.dto.stockoperation.StockAdjustmentCreateDTO;
import org.zerp.resource.dto.stockoperation.StockEntryCreateDTO;
import org.zerp.resource.dto.stockoperation.StockOperationDTO;
import org.zerp.resource.service.StockOperationService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/resource/stock-operations")
@RequiredArgsConstructor
@Tag(name = "StockOperation", description = "Controlled stock entry and adjustment operations")
public class StockOperationController {
    private final StockOperationService service;

    @PostMapping("/entries")
    public ResponseEntity<ApiResponse<StockOperationDTO>> createEntry(@RequestBody StockEntryCreateDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(service.createEntry(data)));
    }

    @PostMapping("/adjustments")
    public ResponseEntity<ApiResponse<StockOperationDTO>> createAdjustment(@RequestBody StockAdjustmentCreateDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(service.createAdjustment(data)));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<StockOperationDTO>>> history(
            @RequestParam UUID shopId,
            @RequestParam(required = false) StockOperationType operationType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) String referenceNo,
            @RequestParam(required = false) Integer limit
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.getHistory(shopId, operationType, from, to, referenceNo, limit)));
    }
}
