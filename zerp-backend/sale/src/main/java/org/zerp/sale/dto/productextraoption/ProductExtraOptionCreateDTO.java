package org.zerp.sale.dto.productextraoption;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ProductExtraOptionCreateDTO {
    private UUID productId;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean isActive = true;
    private List<ProductExtraOptionItemCreateDTO> items;
}
