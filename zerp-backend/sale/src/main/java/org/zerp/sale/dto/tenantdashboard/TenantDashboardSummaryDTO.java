package org.zerp.sale.dto.tenantdashboard;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TenantDashboardSummaryDTO {
    private BigDecimal totalSales;
    private long totalOrders;
    private BigDecimal averageOrderValue;
    private String topProductName;
    private String topStoreName;
}
