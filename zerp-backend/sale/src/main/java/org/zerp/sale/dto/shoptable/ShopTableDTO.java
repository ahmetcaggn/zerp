package org.zerp.sale.dto.shoptable;

import lombok.Data;
import org.zerp.common.entity.sale.ShopTableStatus;

import java.util.UUID;

@Data
public class ShopTableDTO {
    private UUID id;
    private String name;
    private String description;
    private int capacity;
    private int floor;
    private ShopTableStatus status;
    private UUID shopId;
    private String shopName;
    private UUID tenantId;
}
