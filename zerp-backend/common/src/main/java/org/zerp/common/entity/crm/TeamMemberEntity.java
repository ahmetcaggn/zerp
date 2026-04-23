package org.zerp.common.entity.crm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.Permittable;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "team_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE team_member SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
@Inheritance(strategy = InheritanceType.JOINED)
public class TeamMemberEntity extends AppUser implements Permittable {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private TeamEntity team;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TeamMemberRole role;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    // TODO appUser'a gore servisleri guncelle.

    @Override
    public Permittable getParent() {
        return team;
    }

    public enum TeamMemberRole {
        LEADER, MEMBER
    }
}
