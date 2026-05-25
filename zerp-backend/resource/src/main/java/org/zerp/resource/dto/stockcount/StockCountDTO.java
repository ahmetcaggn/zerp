package org.zerp.resource.dto.stockcount;

import lombok.Data;
import org.zerp.common.entity.resource.StockCountStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class StockCountDTO {
    private UUID id;
    private UUID shopId;
    private String shopName;
    private StockCountStatus status;
    private LocalDate countDate;
    private String notes;
    private LocalDateTime approvedAt;
    private UUID approvedBy;
    private List<StockCountItemDTO> items;
    private UUID tenantId;
}
