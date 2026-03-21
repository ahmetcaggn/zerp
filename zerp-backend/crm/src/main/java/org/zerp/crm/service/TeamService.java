package org.zerp.crm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TeamMemberEntity;

import org.zerp.crm.dto.team.*;
import org.zerp.crm.repository.TeamRepository;

import java.time.LocalDateTime;
import java.util.List;

import java.util.stream.Collectors;

@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public TeamResponse createTeam(CreateTeamRequest request) {
        TeamEntity entity = new TeamEntity();
        entity.setName(validateName(request.name()));
        entity.setDescription(request.description());
        entity.setIsActive(true);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeam(Integer teamId) {
        TeamEntity entity = findOrThrow(teamId);
        return toResponse(entity);
    }

    public TeamResponse updateTeam(Integer teamId, UpdateTeamRequest request) {
        TeamEntity entity = findOrThrow(teamId);
        entity.setName(validateName(request.name()));
        entity.setDescription(request.description());

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse deactivateTeam(Integer teamId) {
        TeamEntity entity = findOrThrow(teamId);
        if (!Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Team is already inactive");
        }
        entity.setIsActive(false);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse activateTeam(Integer teamId) {
        TeamEntity entity = findOrThrow(teamId);
        if (Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Team is already active");
        }
        entity.setIsActive(true);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse addMember(Integer teamId, AddMemberRequest request) {
        TeamEntity entity = findOrThrow(teamId);

        if (!Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Cannot add member to an inactive team");
        }

        boolean alreadyMember = entity.getMembers().stream()
                .anyMatch(m -> m.getUserId().equals(request.userId()));
        if (alreadyMember) {
            throw new IllegalArgumentException(
                    String.format("User %s is already a member of this team", request.userId()));
        }

        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(entity);
        member.setUserId(request.userId());
        member.setRole(request.role());
        member.setJoinedAt(LocalDateTime.now());
        entity.getMembers().add(member);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse removeMember(Integer teamId, Integer userId) {
        TeamEntity entity = findOrThrow(teamId);

        boolean removed = entity.getMembers().removeIf(m -> m.getId() != null && m.getId().equals(userId));
        if (!removed) {
            throw new IllegalArgumentException(
                    String.format("User %d is not a member of this team", userId));
        }

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse changeMemberRole(Integer teamId, Integer userId, ChangeMemberRoleRequest request) {
        TeamEntity entity = findOrThrow(teamId);

        TeamMemberEntity member = entity.getMembers().stream()
                .filter(m -> m.getId() != null && m.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("User %d is not a member of this team", userId)));

        member.setRole(request.role());

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    // ─── Helpers ───

    private TeamEntity findOrThrow(Integer teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamId));
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

    private TeamResponse toResponse(TeamEntity entity) {
        List<TeamMemberResponse> memberResponses = entity.getMembers().stream()
                .map(m -> new TeamMemberResponse(
                        m.getId(), m.getUserId(), m.getRole().name(), m.getJoinedAt()))
                .collect(Collectors.toList());

        return new TeamResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                Boolean.TRUE.equals(entity.getIsActive()),
                memberResponses);
    }
}
