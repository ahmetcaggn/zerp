package org.zerp.sale.dto.productextraoption;

import lombok.Data;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductExtraOptionItemDTO {
    private UUID id;
    private UUID stockResourceId;
    private String stockResourceName;
    private BigDecimal quantity;
    private UnitType unitType;
}
