package org.zerp.common.permission.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(
        name = "permission_groups",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_permission_groups_tenant_name", columnNames = {"tenant_id", "name"}),
                @UniqueConstraint(name = "uk_permission_groups_tenant_code", columnNames = {"tenant_id", "code"})
        }
)
@SQLDelete(sql = "UPDATE permission_groups SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
public class PermissionGroup extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 600)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PermissionGroupSource source = PermissionGroupSource.CUSTOM;

    @Enumerated(EnumType.STRING)
    @Column(length = 64)
    private PredefinedPermissionGroupCode code;

    @Column
    private Boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PermissionGroupScopeType scopeType;

    @ElementCollection
    @CollectionTable(name = "permission_group_actions", joinColumns = @JoinColumn(name = "permission_group_id"))
    @Column(name = "action", nullable = false, length = 64)
    @Enumerated(EnumType.STRING)
    private Set<PermissionAction> actions = new LinkedHashSet<>();
}
