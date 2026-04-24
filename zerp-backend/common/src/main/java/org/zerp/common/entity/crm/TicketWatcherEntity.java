package org.zerp.common.entity.crm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.Permittable;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_watcher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketWatcherEntity extends AppUser implements Permittable {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    // TODO appUser'a gore servisleri guncelle.
    @Override
    public Permittable getParent() {
        return ticket;
    }
}
