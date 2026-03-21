package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponse(
        Integer id,
        UUID authorId,
        String authorType,
        String content,
        boolean isInternal,
        LocalDateTime createdAt,
        java.util.List<AttachmentResponse> attachments) {
}
