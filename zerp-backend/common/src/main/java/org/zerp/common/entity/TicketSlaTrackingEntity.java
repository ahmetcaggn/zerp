package org.zerp.common.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_sla_tracker")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketSlaTrackingEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false, unique = true)
    private TicketEntity ticket;
    
    @Column(name = "first_response_due_at")
    private LocalDateTime firstResponseDueAt;
    
    @Column(name = "first_response_at")
    private LocalDateTime firstResponseAt;
    
    @Column(name = "is_first_response_breached", nullable = false)
    private Boolean isFirstResponseBreached = false;

    @Column(name = "is_paused", nullable = false)
    private Boolean isPaused = false;

    @Column(name = "paused_at")
    private LocalDateTime pausedAt;
    
    @Column(name = "resolution_due_at")
    private LocalDateTime resolutionDueAt;
    
    @Column(name = "resolution_at")
    private LocalDateTime resolutionAt;
    
    @Column(name = "is_resolution_breached", nullable = false)
    private Boolean isResolutionBreached = false;
    
    @Column(name = "total_paused_time_minutes")
    private Integer totalPausedTimeMinutes = 0;
}
