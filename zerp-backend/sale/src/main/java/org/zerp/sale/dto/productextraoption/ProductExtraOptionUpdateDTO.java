package org.zerp.sale.dto.productextraoption;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductExtraOptionUpdateDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private Boolean isActive;
    private List<ProductExtraOptionItemCreateDTO> items;
}
