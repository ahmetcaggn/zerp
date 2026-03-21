package org.zerp.crm.dto.team;

import org.zerp.common.entity.crm.TeamMemberEntity.TeamMemberRole;

import java.util.UUID;

public record AddMemberRequest(
        UUID userId,
        TeamMemberRole role) {
}
