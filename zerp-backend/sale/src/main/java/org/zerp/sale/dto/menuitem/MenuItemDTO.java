package org.zerp.sale.dto.menuitem;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class MenuItemDTO {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageId;
    private UUID categoryId;
    private String categoryName;
    private List<UUID> productIds;
    private UUID tenantId;
}
