package org.zerp.crm.dto.team;

import java.time.LocalDateTime;
import java.util.UUID;

public record TeamMemberResponse(
        UUID id,
        UUID userId,
        String displayName,
        String username,
        String email,
        String role,
        LocalDateTime joinedAt) {
}
