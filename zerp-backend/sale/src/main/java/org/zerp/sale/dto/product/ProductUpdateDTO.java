package org.zerp.sale.dto.product;

import lombok.Data;

import java.util.UUID;

@Data
public class ProductUpdateDTO {
    private String name;
    private String description;
    private String imageId;
    private UUID typeId;
    private UUID metricId;
    private Integer preparationTime;
    private Boolean isActive;
}
