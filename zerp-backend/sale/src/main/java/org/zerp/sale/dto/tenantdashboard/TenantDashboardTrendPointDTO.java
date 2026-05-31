package org.zerp.sale.dto.tenantdashboard;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TenantDashboardTrendPointDTO {
    private String label;
    private BigDecimal sales;
    private long orders;
}
