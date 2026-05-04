package org.zerp.sale.dto.product;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductCreateDTO {
    private String name;
    private String description;
    private String imageId;
    private UUID shopId;
    private UUID typeId;
    private UUID metricId;
    private UUID menuItemId;
    private BigDecimal price;
    private Integer preparationTime;
    private boolean isActive = true;
}
