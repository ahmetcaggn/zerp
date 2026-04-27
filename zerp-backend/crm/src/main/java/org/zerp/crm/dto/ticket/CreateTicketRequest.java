package org.zerp.crm.dto.ticket;

import org.zerp.common.entity.crm.TicketEntity.TicketPriority;
import org.zerp.common.entity.crm.TicketEntity.TicketType;

public record CreateTicketRequest(
        String title,
        String description,
        TicketPriority priority,
        TicketType type) {
}
