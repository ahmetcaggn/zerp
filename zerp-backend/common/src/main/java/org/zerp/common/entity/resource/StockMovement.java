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
@Table(name = "stock_movements")
public class StockMovement extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_resource_id", nullable = false)
    private StockResource stockResource;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StockMovementType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "direction")
    private StockMovementDirection direction;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal previousQuantity;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal newQuantity;

    /**
     * Type of the reference entity that triggered this movement (e.g. SALE_ORDER, STOCK_COUNT).
     */
    private String referenceType;

    private UUID referenceId;

    private String notes;
}
