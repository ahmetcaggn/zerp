package org.zerp.resource.dto.stockmovement;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class StockMovementTimelineDTO {
    private LocalDateTime from;
    private LocalDateTime to;
    private String bucket;
    private BigDecimal baselineQuantity;
    private List<StockMovementTimelineBucketDTO> buckets;
}

