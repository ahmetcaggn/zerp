package org.zerp.resource.dto.stockoperation;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StockEntryItemDTO {
    private UUID stockResourceId;
    private BigDecimal quantity;
    private String referenceNo;
    private String notes;
}
