package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.crm.dto.ticket.*;
import org.zerp.crm.service.TicketService;

import java.util.UUID;

@RestController
@RequestMapping("/tickets")
@Tag(name = "Tickets", description = "APIs for managing support tickets")
public class TicketController extends ResourceController<TicketResponse, TicketResponse,
        CreateTicketRequest, UpdateTicketRequest, UUID> {

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
