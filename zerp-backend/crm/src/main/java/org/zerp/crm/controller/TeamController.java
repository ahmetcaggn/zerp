package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.crm.dto.team.*;
import org.zerp.crm.service.TeamService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/crm/teams")
@Tag(name = "Teams", description = "Admin APIs for managing teams and team members")
public class TeamController extends ResourceController<TeamResponse, TeamResponse,
        CreateTeamRequest, UpdateTeamRequest, UUID> {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @Override
    protected TeamService getService() {
        return teamService;
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<TeamResponse> deactivateTeam(@PathVariable UUID id) {
        TeamResponse response = teamService.deactivateTeam(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<TeamResponse> activateTeam(@PathVariable UUID id) {
        TeamResponse response = teamService.activateTeam(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<TeamResponse> addTeamMember(
            @PathVariable UUID id,
            @RequestBody AddMemberRequest request) {
        TeamResponse response = teamService.addMember(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<TeamResponse> removeTeamMember(
            @PathVariable UUID id,
            @PathVariable UUID userId) {
        TeamResponse response = teamService.removeMember(id, userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/members/{userId}/role")
    public ResponseEntity<TeamResponse> changeTeamMemberRole(
            @PathVariable UUID id,
            @PathVariable UUID userId,
            @RequestBody ChangeMemberRoleRequest request) {
        TeamResponse response = teamService.changeMemberRole(id, userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/member-candidates")
    public ResponseEntity<ApiResponse<List<TeamMemberCandidateResponse>>> listTeamMemberCandidates(
            @PathVariable UUID id,
            @RequestParam(name = "_start", defaultValue = "0") int start,
            @RequestParam(name = "_end", defaultValue = "10") int end,
            @RequestParam(name = "_sort", defaultValue = "username") String sortField,
            @RequestParam(name = "_order", defaultValue = "ASC") String sortOrder,
            @RequestParam(name = "username", required = false) String username
    ) {
        Pageable pageable = toPageable(start, end, sortField, sortOrder);
        Page<TeamMemberCandidateResponse> page = teamService.findMemberCandidates(id, username, pageable);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Total-Count");

        return new ResponseEntity<>(buildResponse(page.getContent()), headers, HttpStatus.OK);
    }

    private Pageable toPageable(int start, int end, String sortField, String sortOrder) {
        if (start < 0 || end < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "_start and _end must be greater than or equal to 0");
        }
        if (end <= start) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "_end must be greater than _start");
        }

        Sort.Direction direction;
        try {
            direction = Sort.Direction.fromString(sortOrder);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid _order value: " + sortOrder, ex);
        }

        int pageSize = end - start;
        int pageNumber = start / pageSize;
        return PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortField));
    }
}
