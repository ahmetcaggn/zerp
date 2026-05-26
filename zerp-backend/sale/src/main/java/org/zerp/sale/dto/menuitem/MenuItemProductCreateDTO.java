package org.zerp.sale.dto.menuitem;

import lombok.Data;

import java.util.UUID;

@Data
public class MenuItemProductCreateDTO {
    private UUID productId;
    private Integer quantity;
}
