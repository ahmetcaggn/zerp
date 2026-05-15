package org.zerp.sale.dto.tableorder;

import lombok.Data;
import org.zerp.common.entity.sale.TableOrderStatus;

import java.util.List;
import java.util.UUID;

@Data
public class TableOrderDTO {
    private UUID id;
    private UUID shopTableId;
    private String shopTableName;
    private UUID shopId;
    private String shopName;
    private TableOrderStatus status;
    private String note;
    private List<TableOrderItemDTO> items;
    private UUID tenantId;
}
