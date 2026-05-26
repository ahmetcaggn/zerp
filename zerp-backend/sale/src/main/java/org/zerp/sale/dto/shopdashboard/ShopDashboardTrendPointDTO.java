package org.zerp.sale.dto.shopdashboard;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ShopDashboardTrendPointDTO {
    private String label;
    private BigDecimal revenue;
    private BigDecimal averageCheck;
}
