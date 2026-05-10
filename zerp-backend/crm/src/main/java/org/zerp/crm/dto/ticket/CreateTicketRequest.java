package org.zerp.crm.dto.ticket;

import org.zerp.common.entity.crm.TicketEntity.TicketPriority;
import org.zerp.common.entity.crm.IssueType;

import java.util.UUID;

public record CreateTicketRequest(
        String title,
        String description,
        TicketPriority priority,
        IssueType type,
        UUID tenantId
        ) {
}
