package org.zerp.crm.adapter.persistence;

import org.springframework.stereotype.Repository;
import org.zerp.common.entity.crm.*;
import org.zerp.crm.domain.ticket.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Repository
public class TicketRepositoryAdapter implements TicketRepository {

    private final JpaTicketRepository jpaTicketRepository;

    public TicketRepositoryAdapter(JpaTicketRepository jpaTicketRepository) {
        this.jpaTicketRepository = jpaTicketRepository;
    }

    @Override
    public Ticket save(Ticket ticket) {
        TicketEntity entity;

        boolean isNew = ticket.getId() == null || ticket.getId().getValue() == 0;

        if (isNew) {
            entity = createNewEntity(ticket);
        } else {
            // Load existing managed entity and merge changes into it
            entity = jpaTicketRepository.findById(ticket.getId().getValue())
                    .orElseThrow(() -> new IllegalStateException(
                            "Ticket not found for update: " + ticket.getId().getValue()));
            mergeIntoEntity(ticket, entity);
        }

        TicketEntity saved = jpaTicketRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Ticket> findById(TicketId ticketId) {
        return jpaTicketRepository.findById(ticketId.getValue()).map(this::toDomain);
    }

    @Override
    public List<Ticket> findByCustomerId(Integer customerId) {
        // TODO: Add custom query when needed
        return List.of();
    }

    @Override
    public List<Ticket> findByAssignedAgentId(Integer agentPartyId) {
        // TODO: Add custom query when needed
        return List.of();
    }

    @Override
    public List<Ticket> findByTeamId(Integer teamId) {
        // TODO: Add custom query when needed
        return List.of();
    }

    @Override
    public List<Ticket> findByStatus(TicketStatus status) {
        // TODO: Add custom query when needed
        return List.of();
    }

    @Override
    public List<Ticket> findSlaBreachedTickets() {
        // TODO: Add custom query when needed
        return List.of();
    }

    @Override
    public void delete(TicketId ticketId) {
        jpaTicketRepository.deleteById(ticketId.getValue());
    }

    @Override
    public boolean exists(TicketId ticketId) {
        return jpaTicketRepository.existsById(ticketId.getValue());
    }

    // ─── Create (new entity, no Hibernate state) ───

    private TicketEntity createNewEntity(Ticket ticket) {
        TicketEntity entity = new TicketEntity();
        applyScalarFields(ticket, entity);

        // Assignment
        if (ticket.getCurrentAssignment() != null) {
            entity.setCurrentAssignment(toNewAssignmentEntity(ticket.getCurrentAssignment(), entity));
        }

        // Comments — all new
        for (Comment c : ticket.getComments()) {
            entity.getComments().add(toNewCommentEntity(c, entity));
        }

        // History — all new
        for (History h : ticket.getHistoryEntries()) {
            entity.getHistory().add(toNewHistoryEntity(h, entity));
        }

        // SLA
        if (ticket.getSlaTracking() != null) {
            entity.setSlaTracking(toNewSlaEntity(ticket.getSlaTracking(), entity));
        }

        return entity;
    }

    // ─── Merge (update managed entity in-place, preserve Hibernate references) ───

    private void mergeIntoEntity(Ticket ticket, TicketEntity entity) {
        applyScalarFields(ticket, entity);

        // Assignment
        mergeAssignment(ticket, entity);

        // Comments — match by ID, add new ones
        mergeComments(ticket, entity);

        // History — match by ID, add new ones
        mergeHistory(ticket, entity);

        // SLA
        mergeSla(ticket, entity);
    }

    private void applyScalarFields(Ticket ticket, TicketEntity entity) {
        entity.setTitle(ticket.getTitle());
        entity.setDescription(ticket.getDescription());
        entity.setStatus(TicketEntity.TicketStatus.valueOf(ticket.getStatus().name()));
        entity.setPriority(TicketEntity.TicketPriority.valueOf(ticket.getPriority().name()));
        entity.setTenantId(ticket.getTenantId());
        entity.setCreatedByPartyId(ticket.getCreatedByPartyId());
        entity.setCreatedAt(ticket.getCreatedAt());
        entity.setUpdatedAt(ticket.getUpdatedAt());
        entity.setResolvedAt(ticket.getResolvedAt());
        entity.setClosedAt(ticket.getClosedAt());
    }

    private void mergeAssignment(Ticket ticket, TicketEntity entity) {
        if (ticket.getCurrentAssignment() == null) {
            entity.setCurrentAssignment(null);
            return;
        }

        TicketAssignment domainAssignment = ticket.getCurrentAssignment();
        TicketAssignmentEntity existing = entity.getCurrentAssignment();

        if (existing != null && domainAssignment.getId() != null
                && domainAssignment.getId().equals(existing.getId())) {
            // Update existing managed entity in-place
            existing.setTeamId(domainAssignment.getTeamId());
            existing.setAgentPartyId(domainAssignment.getAgentPartyId());
            existing.setAssignedByPartyId(domainAssignment.getAssignedByPartId());
            existing.setActive(domainAssignment.isActive());
            existing.setReason(domainAssignment.getReason());
            existing.setAssignedAt(domainAssignment.getAssignedAt());
            existing.setUnassignedAt(domainAssignment.getUnassignedAt());
        } else {
            // New assignment — replace
            entity.setCurrentAssignment(toNewAssignmentEntity(domainAssignment, entity));
        }
    }

    private void mergeComments(Ticket ticket, TicketEntity entity) {
        // Index existing managed comments by ID
        Map<Integer, TicketCommentEntity> existingById = entity.getComments().stream()
                .filter(c -> c.getId() != null)
                .collect(Collectors.toMap(TicketCommentEntity::getId, Function.identity()));

        // Determine which domain comments are new (id == null)
        for (Comment domain : ticket.getComments()) {
            if (domain.getId() == null || !existingById.containsKey(domain.getId())) {
                // New comment → add to managed collection
                entity.getComments().add(toNewCommentEntity(domain, entity));
            }
            // Existing comments: already managed by Hibernate, no update needed
            // (comments are typically immutable after creation)
        }
    }

    private void mergeHistory(Ticket ticket, TicketEntity entity) {
        // Index existing managed history entries by ID
        Map<Integer, TicketHistoryEntity> existingById = entity.getHistory().stream()
                .filter(h -> h.getId() != null)
                .collect(Collectors.toMap(TicketHistoryEntity::getId, Function.identity()));

        // Add only new entries (id == null or not in existing)
        for (History domain : ticket.getHistoryEntries()) {
            if (domain.getId() == null || !existingById.containsKey(domain.getId())) {
                entity.getHistory().add(toNewHistoryEntity(domain, entity));
            }
            // Existing history entries: immutable, no update needed
        }
    }

    private void mergeSla(Ticket ticket, TicketEntity entity) {
        if (ticket.getSlaTracking() == null) {
            entity.setSlaTracking(null);
            return;
        }

        SlaTracking domain = ticket.getSlaTracking();
        TicketSlaTrackingEntity existing = entity.getSlaTracking();

        if (existing != null) {
            // Update in-place
            existing.setFirstResponseDueAt(domain.getFirstResponseDueAt());
            existing.setFirstResponseAt(domain.getFirstResponseAt());
            existing.setIsFirstResponseBreached(domain.isFirstResponseBreached());
            existing.setResolutionDueAt(domain.getResolutionDueAt());
            existing.setResolutionAt(domain.getResolutionAt());
            existing.setIsResolutionBreached(domain.isResolutionBreached());
            existing.setTotalPausedTimeMinutes(domain.getTotalPausedTimeMinutes());
        } else {
            entity.setSlaTracking(toNewSlaEntity(domain, entity));
        }
    }

    // ─── Factory methods for new child entities ───

    private TicketAssignmentEntity toNewAssignmentEntity(TicketAssignment assignment, TicketEntity ticket) {
        TicketAssignmentEntity entity = new TicketAssignmentEntity();
        entity.setTicket(ticket);
        entity.setTeamId(assignment.getTeamId());
        entity.setAgentPartyId(assignment.getAgentPartyId());
        entity.setAssignedByPartyId(assignment.getAssignedByPartId());
        entity.setActive(assignment.isActive());
        entity.setReason(assignment.getReason());
        entity.setAssignedAt(assignment.getAssignedAt());
        entity.setUnassignedAt(assignment.getUnassignedAt());
        return entity;
    }

    private TicketCommentEntity toNewCommentEntity(Comment comment, TicketEntity ticket) {
        TicketCommentEntity entity = new TicketCommentEntity();
        entity.setTicket(ticket);
        entity.setAuthorId(comment.getAuthorId());
        entity.setAuthorType(TicketCommentEntity.AuthorType.valueOf(comment.getAuthorType().name()));
        entity.setContent(comment.getContent());
        entity.setIsInternal(comment.isInternal());
        entity.setCreatedAt(comment.getCreatedAt());
        return entity;
    }

    private TicketHistoryEntity toNewHistoryEntity(History history, TicketEntity ticket) {
        TicketHistoryEntity entity = new TicketHistoryEntity();
        entity.setTicket(ticket);
        entity.setEventType(TicketHistoryEntity.EventType.valueOf(history.getEventType().name()));
        entity.setActorPartyId(history.getActorId());
        entity.setReferenceType(history.getReferenceType());
        entity.setReferenceId(history.getReferenceId());
        entity.setPayload(history.getPayload());
        entity.setOccurredAt(history.getOccurredAt());
        return entity;
    }

    private TicketSlaTrackingEntity toNewSlaEntity(SlaTracking sla, TicketEntity ticket) {
        TicketSlaTrackingEntity entity = new TicketSlaTrackingEntity();
        entity.setTicket(ticket);
        entity.setFirstResponseDueAt(sla.getFirstResponseDueAt());
        entity.setFirstResponseAt(sla.getFirstResponseAt());
        entity.setIsFirstResponseBreached(sla.isFirstResponseBreached());
        entity.setResolutionDueAt(sla.getResolutionDueAt());
        entity.setResolutionAt(sla.getResolutionAt());
        entity.setIsResolutionBreached(sla.isResolutionBreached());
        entity.setTotalPausedTimeMinutes(sla.getTotalPausedTimeMinutes());
        entity.setIsPaused(false);
        return entity;
    }

    // ─── Mapping: Entity → Domain ───

    private Ticket toDomain(TicketEntity entity) {
        // Map comments
        List<Comment> comments = new ArrayList<>();
        if (entity.getComments() != null) {
            for (TicketCommentEntity ce : entity.getComments()) {
                Comment comment = Comment.create(
                        ce.getAuthorId(),
                        Comment.AuthorType.valueOf(ce.getAuthorType().name()),
                        ce.getContent(),
                        ce.getIsInternal());
                comment.setId(ce.getId());
                comments.add(comment);
            }
        }

        // Map history
        List<History> historyEntries = new ArrayList<>();
        if (entity.getHistory() != null) {
            for (TicketHistoryEntity he : entity.getHistory()) {
                History history = History.createWithReference(
                        History.EventType.valueOf(he.getEventType().name()),
                        he.getActorPartyId(),
                        he.getReferenceType(),
                        he.getReferenceId(),
                        he.getPayload());
                history.setId(he.getId());
                historyEntries.add(history);
            }
        }

        // Map SLA
        SlaTracking slaTracking = null;
        if (entity.getSlaTracking() != null) {
            TicketSlaTrackingEntity se = entity.getSlaTracking();
            slaTracking = SlaTracking.initialize(TicketPriority.MEDIUM);
            slaTracking.setId(se.getId());
            slaTracking.setFirstResponseDueAt(se.getFirstResponseDueAt());
            slaTracking.setFirstResponseAt(se.getFirstResponseAt());
            slaTracking.setFirstResponseBreached(se.getIsFirstResponseBreached());
            slaTracking.setResolutionDueAt(se.getResolutionDueAt());
            slaTracking.setResolutionAt(se.getResolutionAt());
            slaTracking.setResolutionBreached(se.getIsResolutionBreached());
            slaTracking.setTotalPausedTimeMinutes(se.getTotalPausedTimeMinutes());
        }

        // Map assignment
        TicketAssignment assignment = null;
        if (entity.getCurrentAssignment() != null) {
            TicketAssignmentEntity ae = entity.getCurrentAssignment();
            assignment = TicketAssignment.reconstitute(
                    ae.getId(),
                    entity.getId(),
                    ae.getTeamId(),
                    ae.getAgentPartyId(),
                    ae.getAssignedByPartyId(),
                    ae.getReason(),
                    ae.getAssignedAt(),
                    ae.getUnassignedAt());
        }

        return Ticket.reconstitute(
                TicketId.of(entity.getId()),
                entity.getTitle(),
                entity.getDescription(),
                TicketStatus.valueOf(entity.getStatus().name()),
                TicketPriority.valueOf(entity.getPriority().name()),
                entity.getTenantId(),
                entity.getCreatedByPartyId(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getResolvedAt(),
                entity.getClosedAt(),
                comments,
                historyEntries,
                slaTracking,
                assignment);
    }
}
