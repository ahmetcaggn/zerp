package org.zerp.sale.dto.tenantdashboard;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TenantDashboardStorePerformanceDTO {
    private UUID storeId;
    private String storeName;
    private BigDecimal sales;
    private long orderCount;
}
