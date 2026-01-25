package org.zerp.common.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ticket_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketAssignmentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;

    @Column(name = "team_id", nullable = false)
    private Integer teamId;

    @Column(name = "agent_party_id")
    private Integer agentPartyId;

    @Column(name = "assigned_by_party_id", nullable = false)
    private Integer assignedByPartyId;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "unassigned_at")
    private LocalDateTime unassignedAt;
}
