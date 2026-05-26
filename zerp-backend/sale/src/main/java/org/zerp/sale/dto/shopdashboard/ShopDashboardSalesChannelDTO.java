package org.zerp.sale.dto.shopdashboard;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ShopDashboardSalesChannelDTO {
    private String channelId;
    private long value;
    private BigDecimal percentage;
}
