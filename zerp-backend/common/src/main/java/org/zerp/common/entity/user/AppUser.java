package org.zerp.common.entity.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.util.UUID;

@Entity
@Table
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@PermissionTargetTypeAnnotation(type = PermissionTargetType.USER)
public class AppUser extends BaseEntity implements Permittable {
    @Id
    protected UUID id;

    @Column(unique = true, nullable = false)
    protected String username;

    @Column(unique = true, nullable = false)
    protected String email;

    @ManyToOne
    @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    protected Tenant tenant;

    @Override
    public Permittable getParent() {
        return tenant;
    }
}
