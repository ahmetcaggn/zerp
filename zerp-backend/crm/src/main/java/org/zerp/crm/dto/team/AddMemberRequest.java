package org.zerp.crm.dto.team;

import org.zerp.crm.domain.team.TeamRole;

public record AddMemberRequest(
        Integer userId,
        TeamRole role) {
}
