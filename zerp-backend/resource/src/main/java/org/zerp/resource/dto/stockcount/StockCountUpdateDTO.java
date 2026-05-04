package org.zerp.resource.dto.stockcount;

import lombok.Data;
import org.zerp.common.entity.resource.StockCountStatus;

import java.time.LocalDate;
import java.util.List;

@Data
public class StockCountUpdateDTO {
    private StockCountStatus status;
    private LocalDate countDate;
    private String notes;
    private List<StockCountItemUpdateDTO> items;
}
