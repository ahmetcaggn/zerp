package org.zerp.sale.dto.tableorder;

import lombok.Data;
import org.zerp.common.entity.sale.TableOrderStatus;

import java.util.List;

@Data
public class TableOrderUpdateDTO {
    private TableOrderStatus status;
    private String note;
    private List<TableOrderItemCreateDTO> items;
    private List<TableOrderPaymentCreateDTO> payments;
}
