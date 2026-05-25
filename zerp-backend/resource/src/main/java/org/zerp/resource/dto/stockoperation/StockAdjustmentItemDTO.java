package org.zerp.resource.dto.stockoperation;

import lombok.Data;
import org.zerp.common.entity.resource.StockOperationItemDirection;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StockAdjustmentItemDTO {
    private UUID stockResourceId;
    private BigDecimal quantity;
    private StockOperationItemDirection direction;
    private String reason;
    private String notes;
}
