package org.zerp.resource.dto.resource;

import lombok.Data;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class StockOverviewDTO {
    private UUID stockResourceId;
    private String stockResourceName;
    private UnitType unitType;
    private BigDecimal realQuantity;
    private BigDecimal expectedQuantity;
    private BigDecimal variance;
    private BigDecimal reorderThreshold;
    private UUID lastCountId;
    private LocalDateTime lastCountedAt;
    private UUID lastCountedBy;
    private BigDecimal lastCountQuantity;
    private BigDecimal lastExpectedQuantity;
    private BigDecimal saleDelta;
    private BigDecimal wasteDelta;
    private BigDecimal purchaseDelta;
    private BigDecimal returnDelta;
    private BigDecimal adjustmentDelta;
    private BigDecimal transferDelta;
}
