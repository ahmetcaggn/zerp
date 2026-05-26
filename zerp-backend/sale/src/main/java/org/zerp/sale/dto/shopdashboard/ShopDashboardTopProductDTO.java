package org.zerp.sale.dto.shopdashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ShopDashboardTopProductDTO {
    private UUID menuItemId;
    private String menuItemName;
    private long soldCount;
    private BigDecimal revenue;
}
