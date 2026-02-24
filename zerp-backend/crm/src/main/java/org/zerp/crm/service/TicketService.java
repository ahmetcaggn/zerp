package org.zerp.crm.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerp.crm.domain.ticket.*;
import org.zerp.crm.dto.ticket.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public TicketResponse createTicket(CreateTicketRequest request, Integer actorId) {
        Ticket ticket = Ticket.create(
                request.title(),
                request.description(),
                request.tenantId(),
                actorId,
                request.priority());
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(Integer ticketId) {
        Ticket ticket = findOrThrow(ticketId);
        return toResponse(ticket);
    }

    public TicketResponse changeStatus(Integer ticketId, ChangeStatusRequest request, Integer actorId) {
        Ticket ticket = findOrThrow(ticketId);
        ticket.changeStatus(request.status(), actorId);
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    public TicketResponse changePriority(Integer ticketId, ChangePriorityRequest request, Integer actorId) {
        Ticket ticket = findOrThrow(ticketId);
        ticket.changePriority(request.priority(), actorId);
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    public TicketResponse assignTicket(Integer ticketId, AssignTicketRequest request, Integer actorId) {
        Ticket ticket = findOrThrow(ticketId);
        if (request.agentPartyId() != null) {
            ticket.assignToAgent(request.teamId(), request.agentPartyId(), actorId);
        } else {
            ticket.assignToTeam(request.teamId(), actorId);
        }
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    public TicketResponse unassignTicket(Integer ticketId, Integer actorId) {
        Ticket ticket = findOrThrow(ticketId);
        ticket.unassign(actorId);
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    public TicketResponse addComment(Integer ticketId, AddCommentRequest request, Integer actorId) {
        Ticket ticket = findOrThrow(ticketId);
        boolean isInternal = request.isInternal() != null && request.isInternal();
        ticket.addComment(actorId, Comment.AuthorType.AGENT, request.content(), isInternal);
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    public TicketResponse closeTicket(Integer ticketId, Integer actorId) {
        Ticket ticket = findOrThrow(ticketId);
        ticket.closeTicket(actorId);
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    // ─── Helpers ───

    private Ticket findOrThrow(Integer ticketId) {
        return ticketRepository.findById(TicketId.of(ticketId))
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
    }

    private TicketResponse toResponse(Ticket ticket) {
        TicketAssignmentResponse assignmentResponse = null;
        if (ticket.getCurrentAssignment() != null) {
            TicketAssignment a = ticket.getCurrentAssignment();
            assignmentResponse = new TicketAssignmentResponse(
                    a.getId(), a.getTeamId(), a.getAgentPartyId(),
                    a.isActive(), a.getAssignedAt());
        }

        List<CommentResponse> commentResponses = ticket.getComments().stream()
                .map(c -> new CommentResponse(
                        c.getId(), c.getAuthorId(), c.getAuthorType().name(),
                        c.getContent(), c.isInternal(), c.getCreatedAt()))
                .collect(Collectors.toList());

        TicketResponse.SlaTrackingResponse slaResponse = null;
        if (ticket.getSlaTracking() != null) {
            SlaTracking s = ticket.getSlaTracking();
            slaResponse = new TicketResponse.SlaTrackingResponse(
                    s.getFirstResponseDueAt(), s.getFirstResponseAt(),
                    s.isFirstResponseBreached(),
                    s.getResolutionDueAt(), s.getResolutionAt(),
                    s.isResolutionBreached(),
                    s.getTotalPausedTimeMinutes());
        }

        return new TicketResponse(
                ticket.getId().getValue(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus().name(),
                ticket.getPriority().name(),
                ticket.getTenantId(),
                ticket.getCreatedByPartyId(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                ticket.getResolvedAt(),
                ticket.getClosedAt(),
                assignmentResponse,
                commentResponses,
                slaResponse);
    }
}
