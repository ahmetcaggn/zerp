package org.zerp.common.permission.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.ColumnDefault;
import org.zerp.common.entity.base.CommonBaseEntity;
import org.zerp.common.entity.user.AppUser;

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

    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private AppUser user;

    @Enumerated(EnumType.STRING)
    private PermissionTargetType targetType;

    private UUID targetId;

    @Enumerated(EnumType.STRING)
    private PermissionAction action;

    @Column(name = "manual_grant")
    @ColumnDefault("true")
    @Builder.Default
    private Boolean manualGrant = true;

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
