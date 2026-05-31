package org.zerp.common.permission.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import org.zerp.common.entity.base.BaseEntity;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(
        name = "permission_group_assignments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_pg_assignments_unique_active",
                        columnNames = {
                                "tenant_id",
                                "permission_group_id",
                                "user_id",
                                "target_type",
                                "target_id",
                                "deleted"
                        }
                )
        }
)
public class PermissionGroupAssignment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "permission_group_id", nullable = false, updatable = false)
    private UUID permissionGroupId;

    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 64, updatable = false)
    private PermissionTargetType targetType;

    @Column(name = "target_id", nullable = false, updatable = false)
    private UUID targetId;

    @Column(name = "assigned_by")
    private UUID assignedBy;
}
