package org.zerp.gateway.controller;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.gateway.service.OpenApiAggregatorService;

@RestController
@RequestMapping("/gateway")
public class OpenApiAggregatorController {

    private final OpenApiAggregatorService aggregatorService;

    public OpenApiAggregatorController(OpenApiAggregatorService aggregatorService) {
        this.aggregatorService = aggregatorService;
    }

    @GetMapping(value = "/v3/api-docs/merged", produces = "application/json")
    public String getMergedDocs(ServerHttpRequest request) {
        return aggregatorService.buildMergedSpec(request.getURI());
    }
}