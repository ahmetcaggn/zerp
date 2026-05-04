package org.zerp.resource.dto.stockcount;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StockCountCreateDTO {
    private UUID shopId;
    private LocalDate countDate;
    private String notes;
}
