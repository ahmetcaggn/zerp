package org.zerp.resource.dto.stockmovement;

import lombok.Data;
import org.zerp.common.entity.resource.StockMovementDirection;
import org.zerp.common.entity.resource.StockMovementType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StockMovementCreateDTO {
    private UUID stockResourceId;
    private StockMovementType type;
    private StockMovementDirection direction;
    private BigDecimal quantity;
    private String referenceType;
    private UUID referenceId;
    private String notes;
}
