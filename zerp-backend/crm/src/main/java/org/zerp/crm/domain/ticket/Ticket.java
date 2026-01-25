package org.zerp.crm.domain.ticket;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Ticket Aggregate Root
 * İş kurallarını ve ticket davranışlarını encapsulate eder.
 */
public class Ticket {
    
    private TicketId id;
    private String title;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private Integer createdByPartyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    
    private TicketAssignment currentAssignment;
    private final List<Comment> comments;
    private final List<History> historyEntries;
    private SlaTracking slaTracking;
    
    // Private constructor - factory method kullanımını zorunlu kılar
    private Ticket(TicketId id, String title, String description, Integer createdByPartyId, TicketPriority priority) {
        this.id = id;
        this.title = validateTitle(title);
        this.description = description;
        this.createdByPartyId = createdByPartyId;
        this.priority = priority != null ? priority : TicketPriority.MEDIUM;
        this.status = TicketStatus.OPEN;
        this.createdAt = LocalDateTime.now();
        this.comments = new ArrayList<>();
        this.historyEntries = new ArrayList<>();
        this.slaTracking = SlaTracking.initialize(this.priority);
        
        // First history entry
        addHistory(History.create(History.EventType.CREATED, createdByPartyId,
            String.format("Ticket created with priority: %s", this.priority)));
    }
    
    // Factory method - Ticket creation
    public static Ticket create(String title, String description, Integer createdByPartyId, TicketPriority priority) {
        return new Ticket(TicketId.of(0), title, description, createdByPartyId, priority);
    }
    
    // Reconstitution method - to rebuild Ticket from persistence
    public static Ticket reconstitute(
        TicketId id,
        String title,
        String description,
        TicketStatus status,
        TicketPriority priority,
        Integer createdByPartyId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime resolvedAt,
        LocalDateTime closedAt,
        List<Comment> comments,
        List<History> historyEntries,
        SlaTracking slaTracking,
        TicketAssignment assignment
    ) {
        Ticket ticket = new Ticket(
                id,
                title,
                description,
                createdByPartyId,
                priority
        );

        // Remove initial creation history added by constructor
        ticket.historyEntries.clear();
        ticket.comments.clear();

        ticket.status = status;
        ticket.createdAt = createdAt;
        ticket.updatedAt = updatedAt;
        ticket.resolvedAt = resolvedAt;
        ticket.closedAt = closedAt;
        ticket.slaTracking = slaTracking != null
        ? slaTracking
        : SlaTracking.initialize(priority);

        if (assignment != null) {
            ticket.currentAssignment = assignment;
        }

        if (comments != null) {
            ticket.comments.addAll(comments);
        }

        if (historyEntries != null) {
            ticket.historyEntries.addAll(historyEntries);
        }

        return ticket;
    }

    // Business Rules - Add Comment to Ticket
    public void addComment(Integer authorId, Comment.AuthorType authorType, String content, boolean isInternal) {
        Comment comment = Comment.create(authorId, authorType, content, isInternal);
        this.comments.add(comment);
        this.updatedAt = LocalDateTime.now();
        
        // SLA First Response Tracking
        if (authorType == Comment.AuthorType.AGENT && !isInternal && slaTracking.getFirstResponseAt() == null) {
            slaTracking.recordFirstResponse();
        }
        
        addHistory(History.createWithReference(
            History.EventType.COMMENT_ADDED,
            authorId,
            "COMMENT",
            comment.getId(),
            String.format("Comment added by %s", authorType)
        ));
    }
    
    // Business Rules - Change Status
    public void changeStatus(TicketStatus newStatus, Integer actorId) {
        if (this.status == newStatus) {
            return; // Do nothing if status is the same
        }
        
        if (!this.status.canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                String.format("Cannot transition from %s to %s", this.status, newStatus)
            );
        }
        
        TicketStatus oldStatus = this.status;
        this.status = newStatus;
        this.updatedAt = LocalDateTime.now();
        
        // Special cases
        if (newStatus == TicketStatus.RESOLVED) {
            this.resolvedAt = LocalDateTime.now();
            slaTracking.recordResolution();
        } else if (newStatus == TicketStatus.CLOSED) {
            this.closedAt = LocalDateTime.now();
        } else if (newStatus == TicketStatus.OPEN && oldStatus == TicketStatus.RESOLVED) {
            // reopening a resolved ticket
            this.resolvedAt = null;
            addHistory(History.create(History.EventType.REOPENED, actorId));
        }
        
        addHistory(History.create(
            History.EventType.STATUS_CHANGED,
            actorId,
            String.format("Status changed from %s to %s", oldStatus, newStatus)
        ));
    }
    
    // Business Rules - Change Priority
    public void changePriority(TicketPriority newPriority, Integer actorId) {
        if (this.priority == newPriority) {
            return;
        }
        
        TicketPriority oldPriority = this.priority;
        this.priority = newPriority;
        this.updatedAt = LocalDateTime.now();
        
        addHistory(History.create(
            History.EventType.PRIORITY_CHANGED,
            actorId,
            String.format("Priority changed from %s to %s", oldPriority, newPriority)
        ));
    }

    // Business Rules - Validation for Assignment
    private void validateAssignable() {
        // Domain rule: Kapalı ticket'lara atama yapılamaz
        if (this.status == TicketStatus.CLOSED || this.status == TicketStatus.CANCELLED) {
            throw new IllegalStateException("Cannot assign a closed or cancelled ticket");
        }
    }

    // Business Rules - Assign to Agent
    public void assignToAgent(
        Integer teamId,
        Integer agentPartyId,
        Integer assignedByPartyId
    ) {
        validateAssignable();

        boolean isReassignment =
                this.currentAssignment != null && this.currentAssignment.isActive();

        // Remove existing assignment if any
        if (isReassignment) {
            this.currentAssignment.deactivate();

            addHistory(History.create(
                History.EventType.REASSIGNED,
                assignedByPartyId,
                String.format("Reassigned to agent %s", agentPartyId)
            ));
        }

        // Create new assignment
        this.currentAssignment = TicketAssignment.assignToAgent(
                this.id.getValue(),
                teamId,
                assignedByPartyId,
                agentPartyId,
                "Assigned to agent"
        );

        // First assignment audit
        if (!isReassignment) {
            addHistory(History.create(
                History.EventType.ASSIGNED,
                assignedByPartyId,
                String.format("Assigned to agent %s", agentPartyId)
            ));
        }

        // Ticket state
        if (this.status == TicketStatus.OPEN) {
            changeStatus(TicketStatus.IN_PROGRESS, assignedByPartyId);
        }
        this.updatedAt = LocalDateTime.now();
    }

    
    // Business Rules - Assign to Team
    public void assignToTeam(Integer teamId, Integer actorId) {
        validateAssignable();

        boolean isReassignment =
                this.currentAssignment != null && this.currentAssignment.isActive();

        // Remove existing assignment if any
        if (isReassignment) {
            this.currentAssignment.deactivate();

            addHistory(History.create(
                History.EventType.REASSIGNED,
                actorId,
                String.format("Reassigned to team %s", teamId)
            ));
        }
        this.currentAssignment = TicketAssignment.assignToTeam(id.getValue(), teamId, actorId, "Assigned to team");
        this.updatedAt = LocalDateTime.now();

        // Ticket state
        if (status == TicketStatus.OPEN) {
            changeStatus(TicketStatus.IN_PROGRESS, actorId);
        }

        // First assignment audit
        if (!isReassignment) {
            addHistory(History.create(
                History.EventType.ASSIGNED,
                actorId,
                String.format("Ticket assigned to team: %s", teamId)
            ));
        }
    }

    // Business Rules - Unassign
    public void unassign(Integer actorId) {
        if (this.currentAssignment != null && this.currentAssignment.isActive()) {
            // Deactivate current assignment
            this.currentAssignment.deactivate();
            this.updatedAt = LocalDateTime.now();

            // Audit
            addHistory(History.create(
                History.EventType.UNASSIGNED,
                actorId,
                String.format("Ticket unassigned from %s", currentAssignment.getAgentPartyId() != null ? "agent " + currentAssignment.getAgentPartyId() : "team " + currentAssignment.getTeamId())
            ));

            changeStatus(TicketStatus.OPEN, actorId);
        }
    }

    // Business Rules - Close Ticket
    public void closeTicket(Integer actorId) {
        if (this.status != TicketStatus.CLOSED) {
            changeStatus(TicketStatus.CLOSED, actorId);
        }
    }
    
    // Business Rules - SLA pause
    public void pauseSla(int minutes) {
        if (status.isActive()) {
            slaTracking.pauseTracking(minutes);
        }
    }
    
    // Helper method - History Addition
    private void addHistory(History history) {
        this.historyEntries.add(history);
    }
    
    // Validation
    private String validateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Ticket title cannot be empty");
        }
        if (title.length() > 200) {
            throw new IllegalArgumentException("Ticket title is too long (max 200 characters)");
        }
        return title.trim();
    }
    
    // Getters
    public TicketId getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public TicketStatus getStatus() {
        return status;
    }
    
    public TicketPriority getPriority() {
        return priority;
    }
    
    public Integer getcreatedByPartyId() {
        return createdByPartyId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
    
    public LocalDateTime getClosedAt() {
        return closedAt;
    }
    
    public TicketAssignment getCurrentAssignment() {
        return currentAssignment;
    }

    public List<Comment> getComments() {
        return Collections.unmodifiableList(comments);
    }
    
    public List<History> getHistoryEntries() {
        return Collections.unmodifiableList(historyEntries);
    }
    
    public SlaTracking getSlaTracking() {
        return slaTracking;
    }
    
    // Package-private setters (for reconstitution)
    void setId(TicketId id) {
        this.id = id;
    }
}
