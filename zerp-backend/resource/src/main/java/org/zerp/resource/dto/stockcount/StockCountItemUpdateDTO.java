package org.zerp.resource.dto.stockcount;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StockCountItemUpdateDTO {
    private UUID stockCountItemId;
    private BigDecimal actualQuantity;
    private BigDecimal wasteQuantity;
    private String notes;
}
