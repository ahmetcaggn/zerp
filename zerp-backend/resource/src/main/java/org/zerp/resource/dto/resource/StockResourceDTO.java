package org.zerp.resource.dto.resource;

import lombok.Data;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StockResourceDTO {
    private UUID id;
    private String name;
    private String description;
    private UUID shopId;
    private String shopName;
    private UnitType unitType;
    private BigDecimal quantity;
    private BigDecimal reorderThreshold;
    private BigDecimal costPerUnit;
    private UUID tenantId;
}
