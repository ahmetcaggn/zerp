package org.zerp.sale.dto.tenantdashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TenantDashboardOverviewDTO {
    private BigDecimal totalSales;
    private BigDecimal averageBasket;
    private long totalOrders;
    private long totalStores;
    private TenantDashboardMetricsDeltaDTO metricsDelta;
    private List<TenantDashboardTrendPointDTO> trend;
    private List<TenantDashboardCityDistributionDTO> cityDistribution;
    private List<TenantDashboardStorePerformanceDTO> storePerformance;
    private TenantDashboardSummaryDTO summary;
    private LocalDateTime lastUpdatedAt;
}
