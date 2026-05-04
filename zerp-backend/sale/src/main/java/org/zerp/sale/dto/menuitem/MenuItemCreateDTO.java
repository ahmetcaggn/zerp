package org.zerp.sale.dto.menuitem;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class MenuItemCreateDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private String imageId;
    private UUID categoryId;
    private List<UUID> productIds;
}
