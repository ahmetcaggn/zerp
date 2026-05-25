package org.zerp.common.entity.resource;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.Permittable;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "stock_counts")
@SQLDelete(sql = "UPDATE stock_counts SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.STOCK_COUNT)
public class StockCount extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StockCountStatus status = StockCountStatus.DRAFT;

    @Column(nullable = false)
    private LocalDate countDate;

    private String notes;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @OneToMany(mappedBy = "stockCount", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockCountItem> items = new ArrayList<>();

    @Override
    public String getTitle() {
        if (shop == null) {
            return String.format("Stock Count - %s", countDate.toString());
        }
        return String.format("%s-%s", shop.getTitle(), countDate.toString());
    }

    @Override
    public Permittable getParent() {
        return shop;
    }
}
