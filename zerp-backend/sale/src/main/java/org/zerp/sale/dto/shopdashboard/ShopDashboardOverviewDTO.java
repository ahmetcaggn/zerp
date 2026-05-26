package org.zerp.sale.dto.shopdashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ShopDashboardOverviewDTO {
    private BigDecimal dailyRevenue;
    private BigDecimal averageCheck;
    private long activeTableCount;
    private long totalTableCount;
    private List<ShopDashboardTrendPointDTO> trend;
    private List<ShopDashboardSalesChannelDTO> salesChannels;
    private List<ShopDashboardCategorySalesDTO> categorySales;
    private List<ShopDashboardTopProductDTO> topProducts;
    private ShopDashboardPerformanceDTO performance;
    private List<ShopDashboardLowStockDTO> lowStock;
    private LocalDateTime lastUpdatedAt;
}
