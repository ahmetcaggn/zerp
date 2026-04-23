package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;
import java.util.UUID;

public record AttachmentResponse(
    UUID id,
    String fileName,
    Long fileSize,
    String contentType,
    String storageKey,
    Integer uploadedBy,
    LocalDateTime uploadedAt
) {}
