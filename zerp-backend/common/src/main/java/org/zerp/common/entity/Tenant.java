package org.zerp.common.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.Permittable;

import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name= "tenants")
@SQLDelete(sql = "UPDATE tenants SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class Tenant extends BaseEntity implements Permittable {
    @Id
    private UUID id;

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
    public Permittable getParent() {
        return TenantRoot.INSTANCE;
    }
}
