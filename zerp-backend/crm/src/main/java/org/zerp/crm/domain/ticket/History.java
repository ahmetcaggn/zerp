package org.zerp.crm.domain.ticket;

import java.time.LocalDateTime;

public class History {
    
    private Integer id;
    private final EventType eventType;
    private final Integer actorId;
    private final String referenceType;
    private final Integer referenceId;
    private final String payload;
    private final LocalDateTime occurredAt;
    
    public enum EventType {
        CREATED, STATUS_CHANGED, PRIORITY_CHANGED, ASSIGNED, UNASSIGNED, REASSIGNED,
        COMMENT_ADDED, UPDATED, RESOLVED, CLOSED, REOPENED
    }
    
    private History(EventType eventType, Integer actorId, String referenceType, Integer referenceId, String payload, LocalDateTime occurredAt) {
        this.eventType = eventType;
        this.actorId = actorId;
        this.referenceType = referenceType;
        this.referenceId = referenceId;
        this.payload = payload;
        this.occurredAt = occurredAt != null ? occurredAt : LocalDateTime.now();
    }
    
    public static History create(EventType eventType, Integer actorId) {
        return new History(eventType, actorId, null, null, null, LocalDateTime.now());
    }
    
    public static History create(EventType eventType, Integer actorId, String payload) {
        return new History(eventType, actorId, null, null, payload, LocalDateTime.now());
    }
    
    public static History createWithReference(EventType eventType, Integer actorId, String referenceType, Integer referenceId, String payload) {
        return new History(eventType, actorId, referenceType, referenceId, payload, LocalDateTime.now());
    }
    
    // Getters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public EventType getEventType() {
        return eventType;
    }
    
    public Integer getActorId() {
        return actorId;
    }
    
    public String getReferenceType() {
        return referenceType;
    }
    
    public Integer getReferenceId() {
        return referenceId;
    }
    
    public String getPayload() {
        return payload;
    }
    
    public LocalDateTime getOccurredAt() {
        return occurredAt;
    }
}
