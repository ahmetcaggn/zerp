package org.zerp.resource.dto.stockoperation;

import lombok.Data;
import org.zerp.common.entity.resource.StockOperationStatus;
import org.zerp.common.entity.resource.StockOperationType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class StockOperationDTO {
    private UUID id;
    private UUID shopId;
    private String shopName;
    private StockOperationType operationType;
    private StockOperationStatus status;
    private String referenceNo;
    private String notes;
    private Integer itemCount;
    private LocalDateTime createdAt;
    private UUID tenantId;
    private List<StockOperationItemDTO> items;
}
