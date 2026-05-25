package org.zerp.resource.repository.projection;

import java.math.BigDecimal;

public interface StockMovementSummaryProjection {
    BigDecimal getSaleTotal();
    BigDecimal getWasteTotal();
    BigDecimal getPurchaseTotal();
    BigDecimal getReturnTotal();
    BigDecimal getAdjustmentTotal();
    BigDecimal getTransferTotal();
    BigDecimal getNetDelta();
}
