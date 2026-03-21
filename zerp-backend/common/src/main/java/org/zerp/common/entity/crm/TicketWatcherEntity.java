package org.zerp.common.entity.crm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ticket_watcher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketWatcherEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;

    @Column(name = "watcher_id", nullable = false)
    private UUID watcherId;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;
}
