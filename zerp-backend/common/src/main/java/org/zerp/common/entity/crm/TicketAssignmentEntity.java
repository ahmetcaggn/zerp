package org.zerp.common.entity.crm;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

@Entity
@Table(name = "ticket_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE ticket_assignment SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.TICKET_ASSIGNMENT)
public class TicketAssignmentEntity extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private TeamEntity team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_party_id")
    private AppUser agentParty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_party_id", nullable = false)
    private AppUser assignedByParty;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "unassigned_at")
    private LocalDateTime unassignedAt;

    @Override
    public Permittable getParent() {
        return ticket;
    }
}
