package org.zerp.sale.dto.tableorder;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class TableOrderItemCreateDTO {
    private UUID menuItemId;
    private int quantity;
    private String notes;
    private List<UUID> selectedExtraOptionIds;
}
