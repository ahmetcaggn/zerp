package org.zerp.sale.dto.shopdashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ShopDashboardCategorySalesDTO {
    private UUID categoryId;
    private String categoryName;
    private BigDecimal revenue;
    private BigDecimal percentage;
}
