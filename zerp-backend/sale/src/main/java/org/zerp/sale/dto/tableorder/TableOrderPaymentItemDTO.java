package org.zerp.sale.dto.tableorder;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class TableOrderPaymentItemDTO {
    private UUID id;
    private UUID menuItemId;
    private String menuItemName;
    private int quantity;
    private BigDecimal unitPrice;
    private String notes;
    private List<TableOrderPaymentItemSelectedExtraOptionDTO> selectedExtraOptions;
}
