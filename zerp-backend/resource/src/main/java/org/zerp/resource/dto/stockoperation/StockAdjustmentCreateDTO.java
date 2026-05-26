package org.zerp.resource.dto.stockoperation;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class StockAdjustmentCreateDTO {
    private UUID shopId;
    private String referenceNo;
    private String notes;
    private List<StockAdjustmentItemDTO> items;
}
