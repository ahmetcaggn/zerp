package org.zerp.sale.dto.tableorder;

import lombok.Data;
import org.zerp.common.entity.sale.TableOrderPaymentMethod;

import java.math.BigDecimal;
import java.util.List;

@Data
public class TableOrderPaymentCreateDTO {
    private TableOrderPaymentMethod method;
    private BigDecimal amount;
    private List<TableOrderPaymentItemCreateDTO> items;
}
