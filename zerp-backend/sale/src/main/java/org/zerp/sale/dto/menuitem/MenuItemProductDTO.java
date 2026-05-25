package org.zerp.sale.dto.menuitem;

import lombok.Data;

import java.util.UUID;

@Data
public class MenuItemProductDTO {
    private UUID productId;
    private String productName;
    private Integer quantity;
}
