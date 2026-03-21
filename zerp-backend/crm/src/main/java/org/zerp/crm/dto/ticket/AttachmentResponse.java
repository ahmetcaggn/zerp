package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;

public record AttachmentResponse(
    Integer id,
    String fileName,
    Long fileSize,
    String contentType,
    String storageKey,
    Integer uploadedBy,
    LocalDateTime uploadedAt
) {}
