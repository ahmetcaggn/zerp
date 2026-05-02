package org.zerp.resource.dto.resource;

import lombok.Data;

import java.util.UUID;

@Data
public class StockResourceCreateDTO {
    private String name;
    private UUID shopId;
    private UUID tenantId;
}
