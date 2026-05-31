package org.zerp.sale.dto.tenantdashboard;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TenantDashboardCityDistributionDTO {
    private String city;
    private long storeCount;
    private BigDecimal percentage;
}
