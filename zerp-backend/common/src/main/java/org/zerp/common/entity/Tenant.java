package org.zerp.common.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.permission.entity.Permittable;

import java.util.UUID;

@Entity
@Data
@Table(name= "tenants")
@SQLDelete(sql = "UPDATE tenants SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class Tenant implements Permittable {
    @Id
    UUID id;

    @Override
    public Permittable getParent() {
        // in permittable hierarchy, tenant is the root, so it has no parent
        return null;
    }
}
