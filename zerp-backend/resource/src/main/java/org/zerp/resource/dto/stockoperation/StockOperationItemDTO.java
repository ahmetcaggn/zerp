package org.zerp.resource.dto.stockoperation;

import lombok.Data;
import org.zerp.common.entity.resource.StockOperationItemDirection;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StockOperationItemDTO {
    private UUID id;
    private UUID stockResourceId;
    private String stockResourceName;
    private UnitType unitType;
    private BigDecimal quantity;
    private StockOperationItemDirection direction;
    private BigDecimal unitCost;
    private String reason;
    private String referenceNo;
    private String notes;
    private UUID stockMovementId;
}
