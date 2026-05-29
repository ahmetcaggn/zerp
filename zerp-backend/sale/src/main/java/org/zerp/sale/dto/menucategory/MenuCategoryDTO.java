package org.zerp.sale.dto.menucategory;

import lombok.Data;

import java.util.UUID;

@Data
public class MenuCategoryDTO {
    private UUID id;
    private String name;
    private String description;
    private Integer displayOrder;
    private UUID menuId;
    private String menuName;
    private UUID tenantId;
}
