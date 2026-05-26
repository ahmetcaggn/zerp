package org.zerp.common.dto.feign.resource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zerp.common.entity.resource.StockMovementDirection;
import org.zerp.common.entity.resource.StockMovementType;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementFeignRequest {
    private UUID stockResourceId;
    private StockMovementType type;
    private StockMovementDirection direction;
    private BigDecimal quantity;
    private String referenceType;
    private UUID referenceId;
    private String notes;
    private UUID tenantId;
}
