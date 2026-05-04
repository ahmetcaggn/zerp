package org.zerp.resource.dto.resource;

import lombok.Data;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;

@Data
public class StockResourceUpdateDTO {
    private String name;
    private String description;
    private UnitType unitType;
    private BigDecimal reorderThreshold;
    private BigDecimal costPerUnit;
}
