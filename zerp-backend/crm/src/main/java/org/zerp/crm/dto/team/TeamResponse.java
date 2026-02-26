package org.zerp.crm.dto.team;

import java.util.List;

public record TeamResponse(
        Integer id,
        String name,
        String description,
        boolean isActive,
        List<TeamMemberResponse> members) {
}
