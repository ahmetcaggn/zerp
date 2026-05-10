package org.zerp.common.permission.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;
import org.zerp.common.entity.base.CommonBaseEntity;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@Immutable
@Table(name = "permissions")
@NoArgsConstructor
@AllArgsConstructor
public class Permission extends CommonBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private UUID userId;

    @Enumerated(EnumType.STRING)
    private PermissionTargetType targetType;

    private UUID targetId;

    @Enumerated(EnumType.STRING)
    private PermissionAction action;

    @Override
    public String toString() {
        return "Permission{" +
                "id=" + id +
                ", user=" + userId +
                ", targetType=" + targetType +
                ", targetId=" + targetId +
                ", action=" + action +
                '}';
    }
}
