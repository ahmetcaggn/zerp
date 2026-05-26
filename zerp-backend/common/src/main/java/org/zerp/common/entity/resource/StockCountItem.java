package org.zerp.common.entity.resource;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.zerp.common.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "stock_count_items")
public class StockCountItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_count_id", nullable = false)
    private StockCount stockCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_resource_id", nullable = false)
    private StockResource stockResource;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal theoreticalQuantity;

    @Column(precision = 15, scale = 6)
    private BigDecimal previousQuantity;

    @Column(precision = 15, scale = 6)
    private BigDecimal movementDelta;

    @Column(precision = 15, scale = 6)
    private BigDecimal expectedQuantity;

    @Column(precision = 15, scale = 6)
    private BigDecimal actualQuantity;

    /**
     * Calculated as actualQuantity - theoreticalQuantity. Negative = loss/waste, positive = surplus.
     */
    @Column(precision = 15, scale = 6)
    private BigDecimal discrepancy;

    @Column(precision = 15, scale = 6)
    private BigDecimal wasteQuantity;

    private String notes;

    @Column(name = "counted_by")
    private UUID countedBy;

    @Column(name = "counted_at")
    private LocalDateTime countedAt;
}
