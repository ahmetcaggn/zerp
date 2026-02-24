package org.zerp.crm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerp.crm.domain.team.*;
import org.zerp.crm.dto.team.*;

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
        Team team = Team.create(request.name(), request.description());
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeam(Integer teamId) {
        Team team = findOrThrow(teamId);
        return toResponse(team);
    }

    public TeamResponse updateTeam(Integer teamId, UpdateTeamRequest request) {
        Team team = findOrThrow(teamId);
        team.updateDetails(request.name(), request.description());
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    public TeamResponse deactivateTeam(Integer teamId) {
        Team team = findOrThrow(teamId);
        team.deactivate();
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    public TeamResponse activateTeam(Integer teamId) {
        Team team = findOrThrow(teamId);
        team.activate();
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    public TeamResponse addMember(Integer teamId, AddMemberRequest request) {
        Team team = findOrThrow(teamId);
        team.addMember(request.userId(), request.role());
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    public TeamResponse removeMember(Integer teamId, Integer userId) {
        Team team = findOrThrow(teamId);
        team.removeMember(userId);
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    public TeamResponse changeMemberRole(Integer teamId, Integer userId, ChangeMemberRoleRequest request) {
        Team team = findOrThrow(teamId);
        team.changeMemberRole(userId, request.role());
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    public TeamResponse addTenant(Integer teamId, Integer tenantId) {
        Team team = findOrThrow(teamId);
        team.addTenant(tenantId);
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    public TeamResponse removeTenant(Integer teamId, Integer tenantId) {
        Team team = findOrThrow(teamId);
        team.removeTenant(tenantId);
        Team saved = teamRepository.save(team);
        return toResponse(saved);
    }

    // ─── Helpers ───

    private Team findOrThrow(Integer teamId) {
        return teamRepository.findById(TeamId.of(teamId))
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamId));
    }

    private TeamResponse toResponse(Team team) {
        List<TeamMemberResponse> memberResponses = team.getMembers().stream()
                .map(m -> new TeamMemberResponse(
                        m.getId(), m.getUserId(), m.getRole().name(), m.getJoinedAt()))
                .collect(Collectors.toList());

        return new TeamResponse(
                team.getId().getValue(),
                team.getName(),
                team.getDescription(),
                team.isActive(),
                memberResponses,
                team.getTenantIds());
    }
}
