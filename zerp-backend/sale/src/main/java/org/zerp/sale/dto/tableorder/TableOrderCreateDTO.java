package org.zerp.sale.dto.tableorder;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class TableOrderCreateDTO {
    private UUID tableId;
    private String note;
    private List<TableOrderItemCreateDTO> items;
}
