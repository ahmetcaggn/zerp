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
        name = "permission_group_assignment_permissions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_pg_assignment_permissions_action_active",
                        columnNames = {
                                "permission_group_assignment_id",
                                "action",
                                "target_type",
                                "target_id",
                                "deleted"
                        }
                )
        }
)
public class PermissionGroupAssignmentPermission extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "permission_group_assignment_id", nullable = false, updatable = false)
    private UUID permissionGroupAssignmentId;

    @Column(name = "permission_id", nullable = false)
    private Long permissionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 64)
    private PermissionAction action;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 64)
    private PermissionTargetType targetType;

    @Column(name = "target_id", nullable = false)
    private UUID targetId;
}
