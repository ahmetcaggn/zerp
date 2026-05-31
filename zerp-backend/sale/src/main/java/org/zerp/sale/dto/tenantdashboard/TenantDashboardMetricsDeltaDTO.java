package org.zerp.sale.dto.tenantdashboard;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TenantDashboardMetricsDeltaDTO {
    private BigDecimal totalSalesDeltaPercentage;
    private BigDecimal averageBasketDeltaPercentage;
    private BigDecimal totalOrdersDeltaPercentage;
}
