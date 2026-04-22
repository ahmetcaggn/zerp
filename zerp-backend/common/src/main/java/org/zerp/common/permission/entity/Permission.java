package org.zerp.common.permission.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@Immutable
@Table(name = "permissions")
@NoArgsConstructor
@AllArgsConstructor
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long employeeId;

    @Enumerated(EnumType.STRING)
    private PermissionTargetType targetType;

    private UUID targetId;

    @Enumerated(EnumType.STRING)
    private PermissionAction action;

    @Override
    public String toString() {
        return "Permission{" +
                "id=" + id +
                ", user=" + employeeId +
                ", targetType=" + targetType +
                ", targetId=" + targetId +
                ", action=" + action +
                '}';
    }
}
