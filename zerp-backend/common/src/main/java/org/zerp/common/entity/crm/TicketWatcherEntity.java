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
@Table(name = "ticket_watcher", uniqueConstraints = {
        @UniqueConstraint(name = "uk_ticket_watcher_ticket_user", columnNames = {"ticket_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@PermissionTargetTypeAnnotation(type = PermissionTargetType.TICKET_WATCHER)
public class TicketWatcherEntity implements Permittable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    @Override
    public String getTitle() {
        if (user == null) {
            return String.format("Watcher-%s", ticket.getTitle());
        }
        return String.format("%s-%s", user.getTitle(), ticket.getTitle());
    }

    @Override
    public Permittable getParent() {
        return ticket;
    }
}
