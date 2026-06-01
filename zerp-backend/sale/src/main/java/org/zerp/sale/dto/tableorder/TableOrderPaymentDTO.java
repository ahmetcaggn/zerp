package org.zerp.sale.dto.tableorder;

import lombok.Data;
import org.zerp.common.entity.sale.TableOrderPaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class TableOrderPaymentDTO {
    private UUID id;
    private TableOrderPaymentMethod method;
    private BigDecimal amount;
    private LocalDateTime paidAt;
    private List<TableOrderPaymentItemDTO> items;
}
