package org.zerp.common.entity.crm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;

import java.time.LocalDateTime;
import java.util.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "ticket")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE ticket SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class TicketEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    @Column(name = "account_id")
    private UUID tenantId;

    @Column(name = "reporter_id")
    private UUID reporterId;

    @Column(name = "ticket_type")
    @Enumerated(EnumType.STRING)
    private TicketType type;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @OneToOne(mappedBy = "ticket")
    private TicketAssignmentEntity currentAssignment;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketCommentEntity> comments = new ArrayList<>();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketHistoryEntity> history = new ArrayList<>();

    @OneToOne(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private TicketSlaTrackingEntity slaTracking;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TicketWatcherEntity> watchers = new HashSet<>();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketAttachmentEntity> attachments = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "ticket_tags", joinColumns = @JoinColumn(name = "ticket_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "custom_attributes", columnDefinition = "jsonb")
    private Map<String, Object> customAttributes = new HashMap<>();

    public enum TicketStatus {
        OPEN("Open", true),
        IN_PROGRESS("In Progress", true),
        WAITING_CUSTOMER("Waiting for Customer", true),
        RESOLVED("Resolved", false),
        CLOSED("Closed", false),
        CANCELLED("Cancelled", false);

        private final String displayName;
        private final boolean active;

        TicketStatus(String displayName, boolean active) {
            this.displayName = displayName;
            this.active = active;
        }

        public String getDisplayName() { return displayName; }
        public boolean isActive() { return active; }

        public boolean canTransitionTo(TicketStatus newStatus) {
            return switch (this) {
                case OPEN -> newStatus == IN_PROGRESS || newStatus == CANCELLED;
                case IN_PROGRESS -> newStatus == WAITING_CUSTOMER || newStatus == RESOLVED || newStatus == CANCELLED || newStatus == OPEN;
                case WAITING_CUSTOMER -> newStatus == IN_PROGRESS || newStatus == RESOLVED || newStatus == CANCELLED || newStatus == OPEN;
                case RESOLVED -> newStatus == CLOSED || newStatus == OPEN;
                case CLOSED, CANCELLED -> false;
            };
        }
    }

    public enum TicketPriority {
        LOW("Low", 480),
        MEDIUM("Medium", 240),
        HIGH("High", 120),
        CRITICAL("Critical", 60);

        private final String displayName;
        private final int defaultResponseTimeMinutes;

        TicketPriority(String displayName, int defaultResponseTimeMinutes) {
            this.displayName = displayName;
            this.defaultResponseTimeMinutes = defaultResponseTimeMinutes;
        }

        public String getDisplayName() { return displayName; }
        public int getDefaultResponseTimeMinutes() { return defaultResponseTimeMinutes; }
    }

    public enum TicketType {
        BUG, FEATURE_REQUEST, QUESTION, INCIDENT
    }
}
