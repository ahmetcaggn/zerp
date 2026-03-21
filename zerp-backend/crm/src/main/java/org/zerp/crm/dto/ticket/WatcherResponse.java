package org.zerp.crm.dto.ticket;

import java.time.LocalDateTime;
import java.util.UUID;

public record WatcherResponse(
    UUID watcherId,
    LocalDateTime addedAt
) {}
