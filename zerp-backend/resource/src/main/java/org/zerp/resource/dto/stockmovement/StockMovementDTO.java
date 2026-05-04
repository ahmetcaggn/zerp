package org.zerp.resource.dto.stockmovement;

import lombok.Data;
import org.zerp.common.entity.resource.StockMovementType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StockMovementDTO {
    private UUID id;
    private UUID stockResourceId;
    private String stockResourceName;
    private StockMovementType type;
    private BigDecimal quantity;
    private BigDecimal previousQuantity;
    private BigDecimal newQuantity;
    private String referenceType;
    private UUID referenceId;
    private String notes;
    private UUID tenantId;
}
