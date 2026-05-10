package org.zerp.common.entity.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
public class BaseEntity extends CommonBaseEntity {
    @Column(name = "tenant_id", nullable = false, updatable = false)
    protected UUID tenantId;
}
