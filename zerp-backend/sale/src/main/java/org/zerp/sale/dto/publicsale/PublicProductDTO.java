package org.zerp.sale.dto.publicsale;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PublicProductDTO {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageId;
    private UUID menuItemId;
    private Integer preparationTime;
    private boolean isAvailable;
}
