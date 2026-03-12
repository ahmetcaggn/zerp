package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.crm.dto.ticket.*;
import org.zerp.crm.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "APIs for managing support tickets")
public class TicketController {
    private static final Integer CURRENT_USER_ID = 1;

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@RequestBody CreateTicketRequest request) {
        TicketResponse response = ticketService.createTicket(request, CURRENT_USER_ID);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Integer id) {
        TicketResponse response = ticketService.getTicket(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> changeTicketStatus(
            @PathVariable Integer id,
            @RequestBody ChangeStatusRequest request) {
        TicketResponse response = ticketService.changeStatus(id, request, CURRENT_USER_ID);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/priority")
    public ResponseEntity<TicketResponse> changeTicketPriority(
            @PathVariable Integer id,
            @RequestBody ChangePriorityRequest request) {
        TicketResponse response = ticketService.changePriority(id, request, CURRENT_USER_ID);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable Integer id,
            @RequestBody AssignTicketRequest request) {
        TicketResponse response = ticketService.assignTicket(id, request, CURRENT_USER_ID);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> unassignTicket(@PathVariable Integer id) {
        TicketResponse response = ticketService.unassignTicket(id, CURRENT_USER_ID);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addTicketComment(
            @PathVariable Integer id,
            @RequestBody AddCommentRequest request) {
        TicketResponse response = ticketService.addComment(id, request, CURRENT_USER_ID);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<TicketResponse> closeTicket(@PathVariable Integer id) {
        TicketResponse response = ticketService.closeTicket(id, CURRENT_USER_ID);
        return ResponseEntity.ok(response);
    }
}
