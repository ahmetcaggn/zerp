package org.zerp.resource.dto.stockcount;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StockCountItemDTO {
    private UUID id;
    private UUID stockResourceId;
    private String stockResourceName;
    private String unitTypeAbbreviation;
    private BigDecimal theoreticalQuantity;
    private BigDecimal actualQuantity;
    private BigDecimal discrepancy;
    private BigDecimal wasteQuantity;
    private String notes;
}
