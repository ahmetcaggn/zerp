package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketAssignmentResponse(
        UUID id,
        UUID teamId,
        UUID agentPartyId,
        boolean active,
        LocalDateTime assignedAt) {
}
