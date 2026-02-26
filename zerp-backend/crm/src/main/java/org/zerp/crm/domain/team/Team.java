package org.zerp.crm.domain.team;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Team Aggregate Root
 * Encapsulates business rules and team behaviors.
 */
public class Team {

    private TeamId id;
    private String name;
    private String description;
    private boolean isActive;
    private final List<TeamMember> members;

    // Private constructor for creation — includes defaults
    private Team(TeamId id, String name, String description) {
        this.id = id;
        this.name = validateName(name);
        this.description = description;
        this.isActive = true;
        this.members = new ArrayList<>();
    }

    // Private constructor for reconstitution — no defaults, no side-effects
    private Team(TeamId id, String name, String description, boolean isActive,
            List<TeamMember> members) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.members = new ArrayList<>();
        if (members != null) {
            this.members.addAll(members);
        }
    }

    // Factory method — create new team
    public static Team create(String name, String description) {
        return new Team(TeamId.of(0), name, description);
    }

    // Reconstitution method — rebuild from persistence
    public static Team reconstitute(
            TeamId id,
            String name,
            String description,
            boolean isActive,
            List<TeamMember> members) {
        return new Team(id, name, description, isActive, members);
    }

    // ─── Member Management ───

    public void addMember(Integer userId, TeamRole role) {
        if (!this.isActive) {
            throw new IllegalStateException("Cannot add member to an inactive team");
        }

        boolean alreadyMember = members.stream()
                .anyMatch(m -> m.getUserId().equals(userId));
        if (alreadyMember) {
            throw new IllegalArgumentException(
                    String.format("User %d is already a member of this team", userId));
        }

        members.add(TeamMember.create(userId, role));
    }

    public void removeMember(Integer userId) {
        boolean removed = members.removeIf(m -> m.getUserId().equals(userId));
        if (!removed) {
            throw new IllegalArgumentException(
                    String.format("User %d is not a member of this team", userId));
        }
    }

    public void promoteToLeader(Integer userId) {
        TeamMember member = findMember(userId);
        member.changeRole(TeamRole.LEADER);
    }

    public void changeMemberRole(Integer userId, TeamRole newRole) {
        TeamMember member = findMember(userId);
        member.changeRole(newRole);
    }

    public boolean isMember(Integer userId) {
        return members.stream().anyMatch(m -> m.getUserId().equals(userId));
    }

    // ─── Team Lifecycle ───

    public void deactivate() {
        if (!this.isActive) {
            throw new IllegalStateException("Team is already inactive");
        }
        this.isActive = false;
    }

    public void activate() {
        if (this.isActive) {
            throw new IllegalStateException("Team is already active");
        }
        this.isActive = true;
    }

    public void updateDetails(String name, String description) {
        this.name = validateName(name);
        this.description = description;
    }

    // ─── Helpers ───

    private TeamMember findMember(Integer userId) {
        return members.stream()
                .filter(m -> m.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("User %d is not a member of this team", userId)));
    }

    private String validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be empty");
        }
        if (name.length() > 100) {
            throw new IllegalArgumentException("Team name is too long (max 100 characters)");
        }
        return name.trim();
    }

    // ─── Getters ───

    public TeamId getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public boolean isActive() {
        return isActive;
    }

    public List<TeamMember> getMembers() {
        return Collections.unmodifiableList(members);
    }

    // Package-private setter (for reconstitution)
    void setId(TeamId id) {
        this.id = id;
    }
}
