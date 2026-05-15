package org.zerp.sale.dto.shoptable;

import lombok.Data;
import org.zerp.common.entity.sale.ShopTableStatus;

@Data
public class ShopTableUpdateDTO {
    private String name;
    private String description;
    private int capacity;
    private int floor;
    private ShopTableStatus status;
}
