package org.zerp.sale.dto.productextraoption;

import lombok.Data;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductExtraOptionItemCreateDTO {
    private UUID stockResourceId;
    private BigDecimal quantity;
    private UnitType unitType;
}
