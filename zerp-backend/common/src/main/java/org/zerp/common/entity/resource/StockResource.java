package org.zerp.common.entity.resource;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.zerp.common.entity.Tenant;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.Permittable;

import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@PermissionTargetTypeAnnotation(type = PermissionTargetType.STOCK_RESOURCE)
public class StockResource implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    private String name;

    @Override
    public Permittable getParent() {
        return tenant;
    }
}
