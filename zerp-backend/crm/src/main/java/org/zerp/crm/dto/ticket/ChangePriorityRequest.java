package org.zerp.crm.dto.ticket;

import org.zerp.crm.domain.ticket.TicketPriority;

public record ChangePriorityRequest(
        TicketPriority priority) {
}
