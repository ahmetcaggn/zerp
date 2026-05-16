package org.zerp.common.entity.crm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "team_member", uniqueConstraints = {
        @UniqueConstraint(name = "uk_team_member_team_user", columnNames = {"team_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@PermissionTargetTypeAnnotation(type = PermissionTargetType.TEAM_MEMBER)
public class TeamMemberEntity implements Permittable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private TeamEntity team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TeamMemberRole role;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    @Override
    public String getTitle() {
        if (user == null || team == null) {
            return String.format("TeamMember-%s", id);
        }
        return user.getTitle() + " in " + team.getName();
    }

    @Override
    public Permittable getParent() {
        return team;
    }

    public enum TeamMemberRole {
        LEADER, MEMBER
    }
}
