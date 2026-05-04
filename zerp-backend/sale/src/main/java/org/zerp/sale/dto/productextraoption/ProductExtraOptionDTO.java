package org.zerp.sale.dto.productextraoption;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ProductExtraOptionDTO {
    private UUID id;
    private UUID productId;
    private String productName;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean isActive;
    private List<ProductExtraOptionItemDTO> items;
    private UUID tenantId;
}
