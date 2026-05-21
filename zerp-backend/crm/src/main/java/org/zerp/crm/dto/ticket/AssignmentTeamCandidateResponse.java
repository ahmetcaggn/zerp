package org.zerp.crm.dto.ticket;

import java.util.UUID;

public record AssignmentTeamCandidateResponse(
        UUID id,
        String name,
        String type,
        String displayLabel
) {
}
