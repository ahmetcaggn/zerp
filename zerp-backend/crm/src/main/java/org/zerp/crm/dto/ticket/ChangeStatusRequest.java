package org.zerp.crm.dto.ticket;

import org.zerp.crm.domain.ticket.TicketStatus;

public record ChangeStatusRequest(
        TicketStatus status) {
}
