package org.zerp.crm.dto.ticket;

public record AssignTicketRequest(
        Integer teamId,
        Integer agentPartyId) {
}
