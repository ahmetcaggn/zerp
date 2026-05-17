package org.zerp.crm.dto.team;

import java.util.UUID;

public record TeamMemberCandidateResponse(
        UUID id,
        String displayName,
        String displayLabel,
        String username,
        String email
) {
}
