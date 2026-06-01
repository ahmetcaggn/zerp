package org.zerp.sale.dto.tableorder;

import lombok.Data;

import java.util.UUID;

@Data
public class TableOrderPaymentItemCreateDTO {
    private UUID tableOrderItemId;
    private int quantity;
}
