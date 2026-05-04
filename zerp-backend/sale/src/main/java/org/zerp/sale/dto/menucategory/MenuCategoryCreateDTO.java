package org.zerp.sale.dto.menucategory;

import lombok.Data;

import java.util.UUID;

@Data
public class MenuCategoryCreateDTO {
    private String name;
    private String description;
    private UUID menuId;
}
