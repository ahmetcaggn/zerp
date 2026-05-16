package org.zerp.sale.dto.tableorder;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TableOrderItemDTO {
    private UUID id;
    private UUID menuItemId;
    private String menuItemName;
    private int quantity;
    private BigDecimal unitPrice;
    private String notes;
}
