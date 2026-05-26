package org.zerp.resource.dto.resource;

import lombok.Data;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    private UUID lastCountId;
    private LocalDateTime lastCountedAt;
    private UUID lastCountedBy;
    private BigDecimal lastCountQuantity;
    private BigDecimal lastExpectedQuantity;
    private UUID tenantId;
}
