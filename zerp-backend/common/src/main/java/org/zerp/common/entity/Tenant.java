package org.zerp.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.CommonBaseEntity;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name= "tenants")
@SQLDelete(sql = "UPDATE tenants SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.TENANT)
public class Tenant extends CommonBaseEntity implements Permittable {
    @Id
    private UUID id;

    @Column(unique = true)
    private String name;

    private String description;
    private String imageId;

    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String phone;
    private String email;
    private String website;

    @Override
    public String getTitle() {
        return name;
    }

    @Override
    public Permittable getParent() {
        return TenantRoot.INSTANCE;
    }
}
