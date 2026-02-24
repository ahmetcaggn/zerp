package org.zerp.crm.dto.ticket;

public record AddCommentRequest(
        String content,
        Boolean isInternal) {
}
