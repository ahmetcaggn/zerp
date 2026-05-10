package org.zerp.common.entity.crm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.base.BaseEntity;

import java.time.LocalDateTime;
import java.util.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

@Entity
@Table(name = "ticket")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE ticket SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.TICKET)
public class TicketEntity extends BaseEntity implements Permittable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id")
    private AppUser reporter;

    @Column(name = "ticket_type", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private IssueType type;

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

    @Override
    public Permittable getParent() {
        return tenant;
    }

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

}
