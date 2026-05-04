package org.zerp.sale.dto.productrecipe;

import lombok.Data;

import java.util.List;

@Data
public class ProductRecipeUpdateDTO {
    private String name;
    private Boolean isDefault;
    private String description;
    private List<ProductRecipeItemCreateDTO> items;
}
