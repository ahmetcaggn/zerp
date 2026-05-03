package org.zerp.resource.dto.resource;

import lombok.Data;

import java.util.UUID;

@Data
public class StockResourceDTO {
    private UUID id;
    private UUID shopId;
    private String name;
}
