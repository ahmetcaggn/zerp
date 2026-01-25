package org.zerp.crm.domain.ticket;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port (DDD) - Domain katmanında interface, Adapter katmanında implementation
 * Ticket aggregate'i için repository contract'ı
 */
public interface TicketRepository {
    
    /**
     * Yeni ticket'ı kaydeder
     */
    Ticket save(Ticket ticket);
    
    /**
     * Ticket'ı ID'ye göre bulur
     */
    Optional<Ticket> findById(TicketId ticketId);
    
    /**
     * Müşteriye ait tüm ticket'ları bulur
     */
    List<Ticket> findByCustomerId(UUID customerId);
    
    /**
     * Agent'a atanmış ticket'ları bulur
     */
    List<Ticket> findByAssignedTo(UUID agentId);
    
    /**
     * Takıma atanmış ticket'ları bulur
     */
    List<Ticket> findByTeamId(UUID teamId);
    
    /**
     * Belirli duruma sahip ticket'ları bulur
     */
    List<Ticket> findByStatus(TicketStatus status);
    
    /**
     * SLA ihlali olan ticket'ları bulur
     */
    List<Ticket> findSlaBreachedTickets();
    
    /**
     * Ticket'ı siler (soft delete olabilir)
     */
    void delete(TicketId ticketId);
    
    /**
     * Ticket'ın var olup olmadığını kontrol eder
     */
    boolean exists(TicketId ticketId);
}
