package org.zerp.crm.dto.ticket;

import java.util.UUID;

public record AssignmentTeamMemberCandidateResponse(
        UUID userId,
        String displayName,
        String email,
        String role,
        String displayLabel
) {
}
