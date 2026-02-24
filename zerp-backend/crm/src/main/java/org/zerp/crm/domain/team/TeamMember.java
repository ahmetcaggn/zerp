package org.zerp.crm.domain.team;

import java.time.LocalDateTime;
import java.util.Objects;

public class TeamMember {

    private Integer id;
    private final Integer userId;
    private TeamRole role;
    private final LocalDateTime joinedAt;

    private TeamMember(Integer id, Integer userId, TeamRole role, LocalDateTime joinedAt) {
        this.id = id;
        this.userId = Objects.requireNonNull(userId, "User ID cannot be null");
        this.role = Objects.requireNonNull(role, "Role cannot be null");
        this.joinedAt = joinedAt != null ? joinedAt : LocalDateTime.now();
    }

    public static TeamMember create(Integer userId, TeamRole role) {
        return new TeamMember(null, userId, role, LocalDateTime.now());
    }

    public static TeamMember reconstitute(Integer id, Integer userId, TeamRole role, LocalDateTime joinedAt) {
        return new TeamMember(id, userId, role, joinedAt);
    }

    public void changeRole(TeamRole newRole) {
        Objects.requireNonNull(newRole, "Role cannot be null");
        this.role = newRole;
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public TeamRole getRole() {
        return role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
}
