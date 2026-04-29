package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.crm.dto.ticket.AddCommentRequest;
import org.zerp.crm.dto.ticket.AssignTicketRequest;
import org.zerp.crm.dto.ticket.ChangePriorityRequest;
import org.zerp.crm.dto.ticket.ChangeStatusRequest;
import org.zerp.crm.dto.ticket.TicketResponse;
import org.zerp.crm.service.TicketService;

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

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addTicketComment(
            @PathVariable UUID id,
            @RequestBody AddCommentRequest request) {
        return ResponseEntity.ok(ticketService.addComment(id, request));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<TicketResponse> closeTicket(@PathVariable UUID id) {
        return ResponseEntity.ok(ticketService.closeTicket(id));
    }
}
