package org.zerp.sale.dto.shop;

import lombok.Data;

import java.util.UUID;

@Data
public class ShopDTO {
    private UUID id;
    private String name;
    private String description;
    private UUID tenantId;
}
