package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketAssignmentResponse(
        UUID id,
        UUID teamId,
        String teamName,
        String teamType,
        UUID agentPartyId,
        String agentDisplayName,
        boolean active,
        LocalDateTime assignedAt) {
}
