package org.zerp.common.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ticket_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketHistoryEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;
    
    @Column(name = "event_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private EventType eventType;
    
    @Column(name = "actor_party_id", nullable = false)
    private Integer actorPartyId;
    
    @Column(name = "reference_type")
    private String referenceType;
    
    @Column(name = "reference_id")
    private Integer referenceId;
    
    @Column(columnDefinition = "TEXT")
    private String payload;
    
    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;
    
    public enum EventType {
        CREATED, STATUS_CHANGED, PRIORITY_CHANGED, ASSIGNED, REASSIGNED, 
        COMMENT_ADDED, UPDATED, RESOLVED, CLOSED, REOPENED, SLA_BREACHED, SLA_PAUSED, SLA_RESUMED, CANCELLED, ASSIGNMENT_CLEARED
    }
}
