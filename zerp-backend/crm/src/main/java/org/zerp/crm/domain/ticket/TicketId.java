package org.zerp.crm.domain.ticket;

import java.util.Objects;

public class TicketId {
    
    private final Integer value;
    
    private TicketId(Integer value) {
        this.value = Objects.requireNonNull(value, "TicketId cannot be null");
    }
    
    public static TicketId of(Integer value) {
        return new TicketId(value);
    }
    
    public static TicketId of(String value) {
        return new TicketId(Integer.parseInt(value));
    }
    
    public Integer getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TicketId ticketId = (TicketId) o;
        return Objects.equals(value, ticketId.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return value.toString();
    }
}
