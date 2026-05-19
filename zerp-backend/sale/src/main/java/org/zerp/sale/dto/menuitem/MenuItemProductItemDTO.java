package org.zerp.sale.dto.menuitem;

import lombok.Data;

import java.util.UUID;

@Data
public class MenuItemProductItemDTO {
    private UUID productId;
    private Integer quantity;
}
