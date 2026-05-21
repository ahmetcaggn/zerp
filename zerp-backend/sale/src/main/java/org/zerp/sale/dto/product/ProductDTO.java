package org.zerp.sale.dto.product;

import lombok.Data;

import java.util.UUID;

@Data
public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private String imageId;
    private UUID shopId;
    private String shopName;
    private UUID typeId;
    private String typeName;
    private UUID metricId;
    private String metricName;
    private Integer preparationTime;
    private boolean isActive;
    private UUID tenantId;
}
