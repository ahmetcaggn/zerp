package org.zerp.crm.dto.team;

import java.time.LocalDateTime;

public record TeamMemberResponse(
        Integer id,
        Integer userId,
        String role,
        LocalDateTime joinedAt) {
}
