package org.zerp.resource.dto.stockcount;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class StockCountItemDTO {
    private UUID id;
    private UUID stockResourceId;
    private String stockResourceName;
    private String unitTypeAbbreviation;
    private BigDecimal theoreticalQuantity;
    private BigDecimal previousQuantity;
    private BigDecimal movementDelta;
    private BigDecimal expectedQuantity;
    private BigDecimal actualQuantity;
    private BigDecimal discrepancy;
    private String notes;
    private UUID countedBy;
    private LocalDateTime countedAt;
}
