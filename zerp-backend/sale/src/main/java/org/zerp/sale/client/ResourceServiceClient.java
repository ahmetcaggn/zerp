package org.zerp.sale.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.zerp.common.dto.feign.resource.StockMovementFeignRequest;

import java.util.List;

@FeignClient(name = "RESOURCE")
public interface ResourceServiceClient {

    @PostMapping("/feign/resource/stock-movements/bulk")
    ResponseEntity<Void> createStockMovements(@RequestBody List<StockMovementFeignRequest> requests);
}
