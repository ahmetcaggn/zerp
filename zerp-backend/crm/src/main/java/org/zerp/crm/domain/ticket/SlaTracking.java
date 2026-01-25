package org.zerp.crm.domain.ticket;

import java.time.LocalDateTime;

public class SlaTracking {
    
    private Integer id;
    private LocalDateTime firstResponseDueAt;
    private LocalDateTime firstResponseAt;
    private boolean isFirstResponseBreached;
    private LocalDateTime resolutionDueAt;
    private LocalDateTime resolutionAt;
    private boolean isResolutionBreached;
    private int totalPausedTimeMinutes;
    
    private SlaTracking() {
        this.isFirstResponseBreached = false;
        this.isResolutionBreached = false;
        this.totalPausedTimeMinutes = 0;
    }
    
    public static SlaTracking initialize(TicketPriority priority) {
        SlaTracking tracking = new SlaTracking();
        LocalDateTime now = LocalDateTime.now();
        tracking.firstResponseDueAt = now.plusMinutes(priority.getDefaultResponseTimeMinutes());
        tracking.resolutionDueAt = now.plusMinutes(priority.getDefaultResponseTimeMinutes() * 4);
        return tracking;
    }
    
    public void recordFirstResponse() {
        if (firstResponseAt == null) {
            firstResponseAt = LocalDateTime.now();
            isFirstResponseBreached = firstResponseAt.isAfter(firstResponseDueAt);
        }
    }
    
    public void recordResolution() {
        if (resolutionAt == null) {
            resolutionAt = LocalDateTime.now();
            isResolutionBreached = resolutionAt.isAfter(resolutionDueAt);
        }
    }
    
    public void pauseTracking(int minutes) {
        totalPausedTimeMinutes += minutes;
        if (firstResponseDueAt != null && firstResponseAt == null) {
            firstResponseDueAt = firstResponseDueAt.plusMinutes(minutes);
        }
        if (resolutionDueAt != null && resolutionAt == null) {
            resolutionDueAt = resolutionDueAt.plusMinutes(minutes);
        }
    }
    
    public boolean isFirstResponseOverdue() {
        return firstResponseAt == null && LocalDateTime.now().isAfter(firstResponseDueAt);
    }
    
    public boolean isResolutionOverdue() {
        return resolutionAt == null && LocalDateTime.now().isAfter(resolutionDueAt);
    }
    
    // Getters and setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public LocalDateTime getFirstResponseDueAt() {
        return firstResponseDueAt;
    }
    
    public void setFirstResponseDueAt(LocalDateTime firstResponseDueAt) {
        this.firstResponseDueAt = firstResponseDueAt;
    }
    
    public LocalDateTime getFirstResponseAt() {
        return firstResponseAt;
    }
    
    public void setFirstResponseAt(LocalDateTime firstResponseAt) {
        this.firstResponseAt = firstResponseAt;
    }
    
    public boolean isFirstResponseBreached() {
        return isFirstResponseBreached;
    }
    
    public void setFirstResponseBreached(boolean firstResponseBreached) {
        isFirstResponseBreached = firstResponseBreached;
    }
    
    public LocalDateTime getResolutionDueAt() {
        return resolutionDueAt;
    }
    
    public void setResolutionDueAt(LocalDateTime resolutionDueAt) {
        this.resolutionDueAt = resolutionDueAt;
    }
    
    public LocalDateTime getResolutionAt() {
        return resolutionAt;
    }
    
    public void setResolutionAt(LocalDateTime resolutionAt) {
        this.resolutionAt = resolutionAt;
    }
    
    public boolean isResolutionBreached() {
        return isResolutionBreached;
    }
    
    public void setResolutionBreached(boolean resolutionBreached) {
        isResolutionBreached = resolutionBreached;
    }
    
    public int getTotalPausedTimeMinutes() {
        return totalPausedTimeMinutes;
    }
    
    public void setTotalPausedTimeMinutes(int totalPausedTimeMinutes) {
        this.totalPausedTimeMinutes = totalPausedTimeMinutes;
    }
}
