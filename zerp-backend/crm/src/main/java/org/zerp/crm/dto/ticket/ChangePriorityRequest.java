package org.zerp.crm.dto.ticket;

import org.zerp.common.entity.crm.TicketEntity.TicketPriority;

public record ChangePriorityRequest(
        TicketPriority priority) {
}
