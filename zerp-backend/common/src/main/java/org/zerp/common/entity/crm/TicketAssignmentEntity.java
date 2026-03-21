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

@Entity
@Table(name = "ticket_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE ticket_assignment SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class TicketAssignmentEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;

    @Column(name = "team_id", nullable = false)
    private Integer teamId;

    @Column(name = "agent_party_id")
    private UUID agentPartyId;

    @Column(name = "assigned_by_party_id", nullable = false)
    private UUID assignedByPartyId;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "unassigned_at")
    private LocalDateTime unassignedAt;
}
