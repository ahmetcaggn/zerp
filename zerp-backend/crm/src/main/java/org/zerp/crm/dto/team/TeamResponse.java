package org.zerp.crm.dto.team;

import java.util.List;
import java.util.UUID;

public record TeamResponse(
        UUID id,
        UUID tenantId,
        String name,
        String description,
        String type,
        boolean isActive,
        List<TeamMemberResponse> members) {
}
