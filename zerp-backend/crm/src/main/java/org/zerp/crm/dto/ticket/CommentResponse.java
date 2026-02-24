package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;

public record CommentResponse(
        Integer id,
        Integer authorId,
        String authorType,
        String content,
        boolean isInternal,
        LocalDateTime createdAt) {
}
