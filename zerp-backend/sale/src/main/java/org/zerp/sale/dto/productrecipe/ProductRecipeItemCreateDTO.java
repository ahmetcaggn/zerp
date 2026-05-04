package org.zerp.sale.dto.productrecipe;

import lombok.Data;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductRecipeItemCreateDTO {
    private UUID stockResourceId;
    private BigDecimal quantity;
    private UnitType unitType;
    private String notes;
}
