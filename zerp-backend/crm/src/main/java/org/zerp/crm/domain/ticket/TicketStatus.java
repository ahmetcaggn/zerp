package org.zerp.crm.domain.ticket;

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
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public boolean canTransitionTo(TicketStatus newStatus) {
        return switch (this) {
            case OPEN -> newStatus == IN_PROGRESS || newStatus == CANCELLED;
            case IN_PROGRESS -> newStatus == WAITING_CUSTOMER || newStatus == RESOLVED || newStatus == CANCELLED;
            case WAITING_CUSTOMER -> newStatus == IN_PROGRESS || newStatus == RESOLVED || newStatus == CANCELLED;
            case RESOLVED -> newStatus == CLOSED || newStatus == OPEN;
            case CLOSED -> newStatus == OPEN;
            case CANCELLED -> false;
        };
    }
}
