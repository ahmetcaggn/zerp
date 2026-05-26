package org.zerp.resource.dto.stockoperation;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class StockEntryCreateDTO {
    private UUID shopId;
    private String referenceNo;
    private String notes;
    private List<StockEntryItemDTO> items;
}
