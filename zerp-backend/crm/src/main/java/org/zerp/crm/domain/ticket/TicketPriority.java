package org.zerp.crm.domain.ticket;

public enum TicketPriority {
    LOW("Low", 480),           // 8 hours
    MEDIUM("Medium", 240),     // 4 hours
    HIGH("High", 120),         // 2 hours
    CRITICAL("Critical", 60);  // 1 hour
    
    private final String displayName;
    private final int defaultResponseTimeMinutes;
    
    TicketPriority(String displayName, int defaultResponseTimeMinutes) {
        this.displayName = displayName;
        this.defaultResponseTimeMinutes = defaultResponseTimeMinutes;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public int getDefaultResponseTimeMinutes() {
        return defaultResponseTimeMinutes;
    }
}
