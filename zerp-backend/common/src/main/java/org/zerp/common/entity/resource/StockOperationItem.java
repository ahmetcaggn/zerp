package org.zerp.common.entity.resource;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.zerp.common.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "stock_operation_items")
public class StockOperationItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_id", nullable = false)
    private StockOperation operation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_resource_id", nullable = false)
    private StockResource stockResource;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StockOperationItemDirection direction = StockOperationItemDirection.INCREASE;

    @Column(name = "unit_cost", precision = 15, scale = 3)
    private BigDecimal unitCost;

    private String reason;

    @Column(name = "reference_no")
    private String referenceNo;

    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_movement_id")
    private StockMovement stockMovement;
}
