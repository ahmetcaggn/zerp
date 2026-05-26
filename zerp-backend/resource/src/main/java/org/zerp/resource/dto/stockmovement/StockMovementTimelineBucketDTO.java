package org.zerp.resource.dto.stockmovement;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class StockMovementTimelineBucketDTO {
    private LocalDateTime bucketStart;
    private LocalDateTime bucketEnd;
    private BigDecimal movementDelta;
    private BigDecimal previousQuantity;
    private BigDecimal currentQuantity;
    private Long movementCount;
}

