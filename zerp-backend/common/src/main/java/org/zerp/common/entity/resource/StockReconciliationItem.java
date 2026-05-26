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
@Table(name = "stock_reconciliation_items")
public class StockReconciliationItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_count_id", nullable = false)
    private StockCount stockCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_count_item_id", nullable = false)
    private StockCountItem stockCountItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_resource_id", nullable = false)
    private StockResource stockResource;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal previousQuantity;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal movementDelta;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal expectedQuantity;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal actualQuantity;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal variance;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal saleDelta = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal wasteDelta = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal purchaseDelta = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal returnDelta = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal adjustmentDelta = BigDecimal.ZERO;

    @Column(name = "approved_by", nullable = false)
    private UUID approvedBy;

    @Column(name = "approved_at", nullable = false)
    private LocalDateTime approvedAt;
}
