package org.zerp.sale.dto.menuitem;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class MenuItemUpdateDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private String imageId;
    private Integer calories;
    private String weight;
    private List<String> ingredients;
    private List<String> allergens;
    private List<MenuItemProductItemDTO> productItems;
}
