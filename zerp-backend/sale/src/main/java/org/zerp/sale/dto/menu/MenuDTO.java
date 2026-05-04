package org.zerp.sale.dto.menu;

import lombok.Data;

import java.util.UUID;

@Data
public class MenuDTO {
    private UUID id;
    private String name;
    private String description;
    private UUID shopId;
    private String shopName;
    private UUID tenantId;
}
