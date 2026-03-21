package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.crm.dto.team.*;
import org.zerp.crm.service.TeamService;

@RestController
@RequestMapping("/api/teams")
@Tag(name = "Teams", description = "APIs for managing teams and their members")
public class TeamController extends ResourceController<TeamResponse, TeamResponse,
        CreateTeamRequest, UpdateTeamRequest, Integer> {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @Override
    protected TeamService getService() {
        return teamService;
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<TeamResponse> deactivateTeam(@PathVariable Integer id) {
        TeamResponse response = teamService.deactivateTeam(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<TeamResponse> activateTeam(@PathVariable Integer id) {
        TeamResponse response = teamService.activateTeam(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<TeamResponse> addTeamMember(
            @PathVariable Integer id,
            @RequestBody AddMemberRequest request) {
        TeamResponse response = teamService.addMember(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<TeamResponse> removeTeamMember(
            @PathVariable Integer id,
            @PathVariable Integer userId) {
        TeamResponse response = teamService.removeMember(id, userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/members/{userId}/role")
    public ResponseEntity<TeamResponse> changeTeamMemberRole(
            @PathVariable Integer id,
            @PathVariable Integer userId,
            @RequestBody ChangeMemberRoleRequest request) {
        TeamResponse response = teamService.changeMemberRole(id, userId, request);
        return ResponseEntity.ok(response);
    }
}
