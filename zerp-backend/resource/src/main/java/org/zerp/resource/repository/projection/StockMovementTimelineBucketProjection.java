package org.zerp.resource.repository.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface StockMovementTimelineBucketProjection {
    LocalDateTime getBucketStart();
    BigDecimal getMovementDelta();
    BigDecimal getExpectedDelta();
    Long getMovementCount();
}
