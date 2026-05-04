package org.zerp.sale.dto.productrecipe;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ProductRecipeCreateDTO {
    private UUID productId;
    private String name;
    private boolean isDefault;
    private String description;
    private List<ProductRecipeItemCreateDTO> items;
}
