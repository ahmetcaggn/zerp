package org.zerp.resource.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.dto.feign.resource.StockMovementFeignRequest;
import org.zerp.resource.service.StockMovementService;

import java.util.List;

@RestController
@RequestMapping("/feign/resource/stock-movements")
@RequiredArgsConstructor
public class StockMovementFeignController {

    private final StockMovementService service;

    @PostMapping("/bulk")
    public ResponseEntity<Void> createBulk(@RequestBody List<StockMovementFeignRequest> requests) {
        requests.forEach(service::createInternal);
        return ResponseEntity.ok().build();
    }
}
