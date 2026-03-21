package org.zerp.crm.dto.team;

import org.zerp.common.entity.crm.TeamMemberEntity.TeamMemberRole;

public record ChangeMemberRoleRequest(
        TeamMemberRole role) {
}
