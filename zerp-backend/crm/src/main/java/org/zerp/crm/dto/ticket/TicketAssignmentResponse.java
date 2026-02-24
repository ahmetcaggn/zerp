package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;

public record TicketAssignmentResponse(
        Integer id,
        Integer teamId,
        Integer agentPartyId,
        boolean active,
        LocalDateTime assignedAt) {
}
