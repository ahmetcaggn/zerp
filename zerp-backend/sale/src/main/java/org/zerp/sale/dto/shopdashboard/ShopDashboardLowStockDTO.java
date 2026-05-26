package org.zerp.sale.dto.shopdashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ShopDashboardLowStockDTO {
    private UUID stockResourceId;
    private String name;
    private BigDecimal quantity;
    private BigDecimal reorderThreshold;
    private String unitType;
}
