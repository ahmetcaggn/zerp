package org.zerp.sale.dto.menu;

import lombok.Data;

import java.util.UUID;

@Data
public class MenuCreateDTO {
    private String name;
    private String description;
    private boolean isActive = false;
    private UUID shopId;
}
