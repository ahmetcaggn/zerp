package org.zerp.common.entity.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.base.BaseEntity;

import java.util.UUID;

@Entity
@Table
@Getter
@Setter
public class AppUser extends BaseEntity {
    @Id
    protected UUID id;

    @Column(unique = true, nullable = false)
    protected String username;

    @Column(unique = true, nullable = false)
    protected String email;

    @ManyToOne
    @JoinColumn(name = "tenant_id")
    protected Tenant tenant;
}
