package org.zerp.common.entity.resource;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.Permittable;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "stock_movements")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.STOCK_MOVEMENT)
public class StockMovement extends BaseEntity implements Permittable {
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

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal previousQuantity;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal newQuantity;

    /**
     * Type of the reference entity that triggered this movement (e.g. SALE_ORDER, STOCK_COUNT).
     */
    private String referenceType;

    private UUID referenceId;

    private String notes;

    @Override
    public String getTitle() {
        String resourceName = stockResource == null ? "UNKNOWN_RESOURCE" : stockResource.getName();
        String movementType = type == null ? "UNKNOWN_TYPE" : type.name();
        return String.format("%s-%s", resourceName, movementType);
    }

    @Override
    public Permittable getParent() {
        return stockResource;
    }
}
