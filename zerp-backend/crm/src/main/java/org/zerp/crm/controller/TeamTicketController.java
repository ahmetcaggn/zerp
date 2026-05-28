package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.ApiResponse;
import org.zerp.crm.dto.ticket.AddCommentRequest;
import org.zerp.crm.dto.ticket.AssignTicketRequest;
import org.zerp.crm.dto.ticket.AssignmentTeamCandidateResponse;
import org.zerp.crm.dto.ticket.AssignmentTeamMemberCandidateResponse;
import org.zerp.crm.dto.ticket.ChangePriorityRequest;
import org.zerp.crm.dto.ticket.ChangeStatusRequest;
import org.zerp.crm.dto.ticket.TicketResponse;
import org.zerp.crm.service.TicketService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/crm/tickets")
@Tag(name = "Team Tickets", description = "APIs for team members to operate on tickets")
public class TeamTicketController {

    private final TicketService ticketService;

    public TeamTicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> changeTicketStatus(
            @PathVariable UUID id,
            @RequestBody ChangeStatusRequest request) {
        return ResponseEntity.ok(ticketService.changeStatus(id, request));
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<TicketResponse> changeTicketPriority(
            @PathVariable UUID id,
            @RequestBody ChangePriorityRequest request) {
        return ResponseEntity.ok(ticketService.changePriority(id, request));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable UUID id,
            @RequestBody AssignTicketRequest request) {
        return ResponseEntity.ok(ticketService.assignTicket(id, request));
    }

    @DeleteMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> unassignTicket(@PathVariable UUID id) {
        return ResponseEntity.ok(ticketService.unassignTicket(id));
    }

    @GetMapping("/{id}/assignment-candidates/teams")
    public ResponseEntity<ApiResponse<List<AssignmentTeamCandidateResponse>>> listAssignmentTeamCandidates(
            @PathVariable UUID id,
            @RequestParam(name = "_start", defaultValue = "0") int start,
            @RequestParam(name = "_end", defaultValue = "10") int end,
            @RequestParam(name = "_sort", defaultValue = "name") String sortField,
            @RequestParam(name = "_order", defaultValue = "ASC") String sortOrder,
            @RequestParam(name = "query", required = false) String query
    ) {
        Pageable pageable = toPageable(start, end, sortField, sortOrder);
        Page<AssignmentTeamCandidateResponse> page = ticketService.findAssignmentTeamCandidates(id, query, pageable);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Total-Count");

        return new ResponseEntity<>(buildResponse(page.getContent()), headers, HttpStatus.OK);
    }

    @GetMapping("/{id}/assignment-candidates/members")
    public ResponseEntity<ApiResponse<List<AssignmentTeamMemberCandidateResponse>>> listAssignmentTeamMemberCandidates(
            @PathVariable UUID id,
            @RequestParam(name = "teamId") UUID teamId,
            @RequestParam(name = "_start", defaultValue = "0") int start,
            @RequestParam(name = "_end", defaultValue = "10") int end,
            @RequestParam(name = "_sort", defaultValue = "joinedAt") String sortField,
            @RequestParam(name = "_order", defaultValue = "ASC") String sortOrder,
            @RequestParam(name = "query", required = false) String query
    ) {
        Pageable pageable = toPageable(start, end, sortField, sortOrder);
        Page<AssignmentTeamMemberCandidateResponse> page = ticketService.findAssignmentTeamMemberCandidates(
                id, teamId, query, pageable);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Total-Count");

        return new ResponseEntity<>(buildResponse(page.getContent()), headers, HttpStatus.OK);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addTicketComment(
            @PathVariable UUID id,
            @RequestBody AddCommentRequest request) {
        return ResponseEntity.ok(ticketService.addComment(id, request));
    }

    private <T> ApiResponse<List<T>> buildResponse(List<T> data) {
        return ApiResponse.<List<T>>builder()
                .success(true)
                .statusCode(HttpStatus.OK.value())
                .message("Success")
                .data(data)
                .build();
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
