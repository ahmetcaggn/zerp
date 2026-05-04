package org.zerp.sale.dto.menuitem;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MenuItemUpdateDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private String imageId;
}
