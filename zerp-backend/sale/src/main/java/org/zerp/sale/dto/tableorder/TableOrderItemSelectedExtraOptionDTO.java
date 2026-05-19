package org.zerp.sale.dto.tableorder;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TableOrderItemSelectedExtraOptionDTO {
    private UUID extraOptionId;
    private String name;
    private BigDecimal price;
}
