package org.zerp.common.entity.resource;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_resources")
@Getter
@Setter
@SQLDelete(sql = "UPDATE stock_resources SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.STOCK_RESOURCE)
public class StockResource extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit_type")
    private UnitType unitType;

    /**
     * Current real quantity. This value is authoritative and must be updated only by approved stock counts.
     */
    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal quantity = BigDecimal.ZERO;

    /**
     * Minimum quantity threshold below which a reorder alert is triggered.
     */
    @Column(precision = 15, scale = 6)
    private BigDecimal reorderThreshold;

    @Column(precision = 10, scale = 2)
    private BigDecimal costPerUnit;

    @Column(name = "last_count_id")
    private UUID lastCountId;

    @Column(name = "last_counted_at")
    private LocalDateTime lastCountedAt;

    @Column(name = "last_counted_by")
    private UUID lastCountedBy;

    /**
     * Actual quantity entered in the most recently approved stock count.
     */
    @Column(name = "last_count_quantity", precision = 15, scale = 6)
    private BigDecimal lastCountQuantity;

    /**
     * Expected quantity snapshot at the moment of the most recently approved stock count.
     */
    @Column(name = "last_expected_quantity", precision = 15, scale = 6)
    private BigDecimal lastExpectedQuantity;

    @Override
    public String getTitle() {
        return name;
    }

    @Override
    public Permittable getParent() {
        return shop;
    }
}
