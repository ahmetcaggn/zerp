package org.zerp.sale.dto.product;

import lombok.Data;

import java.util.UUID;

@Data
public class ProductCreateDTO {
    private String name;
    private String description;
    private String imageId;
    private UUID shopId;
    private UUID typeId;
    private UUID metricId;
    private Integer preparationTime;
    private boolean isActive = true;
}
