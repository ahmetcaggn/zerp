package org.zerp.common.entity.sale;


import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;

import java.util.UUID;

@Entity
@Data
@Table(name= "shop_tables")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.SHOP_TABLE)
public class ShopTable extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;
    private String name;
    private String description;
    private int capacity;
    private int floor;

    @Enumerated(EnumType.STRING)
    private ShopTableStatus status;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @Override
    public String getTitle() {
        if (shop == null) {
            return name;
        }
        return String.format("%s (%s-%s)", name, shop.getTitle(), floor);
    }

    @Override
    public Permittable getParent() {
        return shop;
    }
}
