package org.zerp.crm.dto.team;

import org.zerp.common.entity.crm.IssueType;

public record CreateTeamRequest(
        String name,
        String description,
        IssueType type) {
}
