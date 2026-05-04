package org.zerp.sale.dto.productrecipe;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ProductRecipeDTO {
    private UUID id;
    private UUID productId;
    private String productName;
    private String name;
    private boolean isDefault;
    private String description;
    private List<ProductRecipeItemDTO> items;
    private UUID tenantId;
}
