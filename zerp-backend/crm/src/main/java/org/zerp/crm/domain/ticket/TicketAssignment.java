package org.zerp.crm.domain.ticket;

import java.time.LocalDateTime;

public class TicketAssignment {

    private Integer id;
    private final Integer ticketId;
    private final Integer teamId;
    private final Integer assignedByPartId;
    private final Integer agentPartyId;
    private Boolean active = true;
    private final String reason;
    private final LocalDateTime assignedAt;
    private LocalDateTime unassignedAt;
    
    private TicketAssignment(
            Integer id,
            Integer ticketId,
            Integer teamId,
            Integer assignedByPartId,
            Integer agentPartyId,
            String reason,
            LocalDateTime assignedAt,
            LocalDateTime unassignedAt
    ) {
        this.id = id;
        this.ticketId = ticketId;
        this.teamId = teamId;
        this.assignedByPartId = assignedByPartId;
        this.agentPartyId = agentPartyId;
        this.reason = reason;
        this.assignedAt = assignedAt;
        this.unassignedAt = unassignedAt;
    }

    public static TicketAssignment assignToTeam(
            Integer ticketId,
            Integer teamId,
            Integer assignedByPartId,
            String reason
    ) {
        return new TicketAssignment(
                null,
                ticketId,
                teamId,
                assignedByPartId,
                null,
                reason,
                LocalDateTime.now(),
                null
        );
    }

    public static TicketAssignment assignToAgent(
            Integer ticketId,
            Integer teamId,
            Integer assignedByPartId,
            Integer agentPartyId,
            String reason
    ) {
        return new TicketAssignment(
                null,
                ticketId,
                teamId,
                assignedByPartId,
                agentPartyId,
                reason,
                LocalDateTime.now(),
                null
        );
    }

    public static TicketAssignment reconstitute(
        Integer id,
        Integer ticketId,
        Integer teamId,
        Integer agentPartyId,
        Integer assignedByPartId,
        String reason,
        LocalDateTime assignedAt,
        LocalDateTime unassignedAt
    ) {
        return new TicketAssignment(
                id,
                ticketId,
                teamId,
                assignedByPartId,
                agentPartyId,
                reason,
                assignedAt,
                unassignedAt
        );
    }

    public void deactivate() {
        if (!this.active) {
            throw new IllegalStateException("Assignment already inactive");
        }
        this.active = false;
        this.unassignedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return Boolean.TRUE.equals(active);
    }
        
    // Getters
    public Integer getId() {
        return id;
    }
    
    public Integer getTicketId() {
        return ticketId;
    }
    
    public Integer getTeamId() {
        return teamId;
    }
    
    public Integer getAssignedByPartId() {
        return assignedByPartId;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public String getReason() {
        return reason;
    }
    
    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
    
    public LocalDateTime getUnassignedAt() {
        return unassignedAt;
    }

    public Integer getAgentPartyId() {
        return agentPartyId;
    }
    
    // Setters
    public void setId(Integer id) {
        this.id = id;
    }
    
    public void setUnassignedAt(LocalDateTime unassignedAt) {
        this.unassignedAt = unassignedAt;
    }
}
