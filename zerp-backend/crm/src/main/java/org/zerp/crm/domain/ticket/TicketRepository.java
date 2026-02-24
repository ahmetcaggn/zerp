package org.zerp.crm.domain.ticket;

import java.util.List;
import java.util.Optional;

/**
 * Port (DDD) — Domain layer interface, Adapter layer implementation
 * Repository contract for the Ticket aggregate
 */
public interface TicketRepository {

    /**
     * Saves a new or updated ticket
     */
    Ticket save(Ticket ticket);

    /**
     * Finds a ticket by its ID
     */
    Optional<Ticket> findById(TicketId ticketId);

    /**
     * Finds all tickets created by a customer
     */
    List<Ticket> findByCustomerId(Integer customerId);

    /**
     * Finds tickets assigned to a specific agent
     */
    List<Ticket> findByAssignedAgentId(Integer agentPartyId);

    /**
     * Finds tickets assigned to a specific team
     */
    List<Ticket> findByTeamId(Integer teamId);

    /**
     * Finds tickets with a specific status
     */
    List<Ticket> findByStatus(TicketStatus status);

    /**
     * Finds tickets with SLA breaches
     */
    List<Ticket> findSlaBreachedTickets();

    /**
     * Deletes a ticket (soft delete)
     */
    void delete(TicketId ticketId);

    /**
     * Checks whether a ticket exists
     */
    boolean exists(TicketId ticketId);
}
