package org.zerp.sale.dto.shopdashboard;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ShopDashboardPerformanceDTO {
    private BigDecimal totalRevenue;
    private BigDecimal totalRevenueDeltaPercentage;
    private BigDecimal averageCheck;
    private BigDecimal averageCheckDeltaPercentage;
    private long totalTableServiceCount;
    private BigDecimal totalTableServiceCountDeltaPercentage;
    private BigDecimal customerSatisfaction;
}
