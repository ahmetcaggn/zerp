package org.zerp.common.entity.resource;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.Permittable;

import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@PermissionTargetTypeAnnotation(type = PermissionTargetType.STOCK_RESOURCE)
public class StockResource extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    private String name;

    @Override
    public Permittable getParent() {
        return shop;
    }
}
