package org.zerp.crm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.crm.dto.team.*;
import org.zerp.crm.service.TeamService;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(@RequestBody CreateTeamRequest request) {
        TeamResponse response = teamService.createTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable Integer id) {
        TeamResponse response = teamService.getTeam(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamResponse> updateTeam(
            @PathVariable Integer id,
            @RequestBody UpdateTeamRequest request) {
        TeamResponse response = teamService.updateTeam(id, request);
        return ResponseEntity.ok(response);
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
    public ResponseEntity<TeamResponse> addMember(
            @PathVariable Integer id,
            @RequestBody AddMemberRequest request) {
        TeamResponse response = teamService.addMember(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<TeamResponse> removeMember(
            @PathVariable Integer id,
            @PathVariable Integer userId) {
        TeamResponse response = teamService.removeMember(id, userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/members/{userId}/role")
    public ResponseEntity<TeamResponse> changeMemberRole(
            @PathVariable Integer id,
            @PathVariable Integer userId,
            @RequestBody ChangeMemberRoleRequest request) {
        TeamResponse response = teamService.changeMemberRole(id, userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/tenants/{tenantId}")
    public ResponseEntity<TeamResponse> addTenant(
            @PathVariable Integer id,
            @PathVariable Integer tenantId) {
        TeamResponse response = teamService.addTenant(id, tenantId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/tenants/{tenantId}")
    public ResponseEntity<TeamResponse> removeTenant(
            @PathVariable Integer id,
            @PathVariable Integer tenantId) {
        TeamResponse response = teamService.removeTenant(id, tenantId);
        return ResponseEntity.ok(response);
    }
}
