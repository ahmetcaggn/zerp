package org.zerp.crm.dto.ticket;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

public record TicketAttachmentContentResponse(
        Resource resource,
        MediaType contentType
) {
}
