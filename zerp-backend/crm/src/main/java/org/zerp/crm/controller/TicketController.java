package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.crm.dto.ticket.*;
import org.zerp.crm.service.TicketService;

import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "APIs for managing support tickets")
public class TicketController extends ResourceController<TicketResponse, TicketResponse,
        CreateTicketRequest, UpdateTicketRequest, Integer> {
    private static final UUID CURRENT_USER_ID = UUID.fromString("2b9de1ef-3cda-4226-b1e7-e23a178cdb7e");

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @Override
    protected TicketService getService() {
        return ticketService;
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
