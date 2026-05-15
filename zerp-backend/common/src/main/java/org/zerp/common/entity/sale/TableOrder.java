package org.zerp.common.entity.sale;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.Permittable;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "table_orders")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.TABLE_ORDER)
public class TableOrder extends BaseEntity implements Permittable {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "shop_table_id", nullable = false)
    private ShopTable shopTable;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Enumerated(EnumType.STRING)
    private TableOrderStatus status = TableOrderStatus.OPEN;

    private String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TableOrderItem> items = new ArrayList<>();

    @Override
    public String getTitle() {
        return String.format("%s-%s", shop.getName(), getCreatedAt());
    }

    @Override
    public Permittable getParent() {
        return shopTable;
    }
}
