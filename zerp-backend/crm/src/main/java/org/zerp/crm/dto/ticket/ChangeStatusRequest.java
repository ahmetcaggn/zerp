package org.zerp.crm.dto.ticket;

import org.zerp.common.entity.crm.TicketEntity.TicketStatus;

public record ChangeStatusRequest(
        TicketStatus status) {
}
