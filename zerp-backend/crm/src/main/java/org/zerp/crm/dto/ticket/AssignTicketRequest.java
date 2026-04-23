package org.zerp.crm.dto.ticket;

import java.util.UUID;

public record AssignTicketRequest(
        UUID teamId,
        UUID agentPartyId) {
}
