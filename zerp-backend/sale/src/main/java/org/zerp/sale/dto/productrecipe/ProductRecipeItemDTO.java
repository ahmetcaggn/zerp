package org.zerp.sale.dto.productrecipe;

import lombok.Data;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductRecipeItemDTO {
    private UUID id;
    private UUID stockResourceId;
    private String stockResourceName;
    private BigDecimal quantity;
    private UnitType unitType;
    private BigDecimal convertedQuantity;
    private UnitType baseUnitType;
    private String notes;
}
