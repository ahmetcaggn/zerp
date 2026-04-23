package org.zerp.crm.dto.team;

import java.util.List;
import java.util.UUID;

public record TeamResponse(
        UUID id,
        String name,
        String description,
        boolean isActive,
        List<TeamMemberResponse> members) {
}
