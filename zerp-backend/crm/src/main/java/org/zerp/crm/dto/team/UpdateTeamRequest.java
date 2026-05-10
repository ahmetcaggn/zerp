package org.zerp.crm.dto.team;

import org.zerp.common.entity.crm.IssueType;

public record UpdateTeamRequest(
        String name,
        String description,
        IssueType type) {
}
