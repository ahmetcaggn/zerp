package org.zerp.crm.dto.team;

import java.time.LocalDateTime;
import java.util.UUID;

public record TeamMemberResponse(
        Integer id,
        UUID userId,
        String role,
        LocalDateTime joinedAt) {
}
