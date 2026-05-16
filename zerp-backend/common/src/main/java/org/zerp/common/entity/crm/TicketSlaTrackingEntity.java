package org.zerp.common.entity.crm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ticket_sla_tracker")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE ticket_sla_tracker SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.TICKET_SLA_TRACKING)
public class TicketSlaTrackingEntity extends BaseEntity implements Permittable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

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

    @Override
    public String getTitle() {
        if (ticket == null) {
            return "SLA-UNKNOWN_TICKET";
        }
        return String.format("SLA-%s", ticket.getTitle());
    }

    @Override
    public Permittable getParent() {
        return ticket;
    }
}
