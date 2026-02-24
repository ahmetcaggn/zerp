package org.zerp.crm.dto.ticket;

import org.zerp.crm.domain.ticket.TicketPriority;

public record CreateTicketRequest(
        String title,
        String description,
        Integer tenantId,
        TicketPriority priority) {
}
