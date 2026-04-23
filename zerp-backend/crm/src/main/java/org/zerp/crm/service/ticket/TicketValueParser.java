package org.zerp.crm.service.ticket;

import org.springframework.stereotype.Component;
import org.zerp.common.entity.crm.TicketEntity.TicketPriority;
import org.zerp.common.entity.crm.TicketEntity.TicketStatus;
import org.zerp.common.entity.crm.TicketEntity.TicketType;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Component
public class TicketValueParser {

    public TicketStatus parseStatus(Object rawValue, String fieldName) {
        if (rawValue instanceof TicketStatus status) {
            return status;
        }

        try {
            return TicketStatus.valueOf(String.valueOf(rawValue).trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid status value for " + fieldName + ": " + rawValue);
        }
    }

    public TicketPriority parsePriority(Object rawValue, String fieldName) {
        if (rawValue instanceof TicketPriority priority) {
            return priority;
        }

        try {
            return TicketPriority.valueOf(String.valueOf(rawValue).trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid priority value for " + fieldName + ": " + rawValue);
        }
    }

    public TicketType parseType(Object rawValue, String fieldName) {
        if (rawValue instanceof TicketType type) {
            return type;
        }

        try {
            return TicketType.valueOf(String.valueOf(rawValue).trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid type value for " + fieldName + ": " + rawValue);
        }
    }

    public UUID parseRequiredUuid(Object rawValue, String fieldName) {
        if (rawValue instanceof UUID uuid) {
            return uuid;
        }

        if (rawValue == null || String.valueOf(rawValue).isBlank()) {
            throw new IllegalArgumentException("UUID value for " + fieldName + " cannot be empty");
        }

        try {
            return UUID.fromString(String.valueOf(rawValue).trim());
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid UUID value for " + fieldName + ": " + rawValue);
        }
    }

    public UUID parseNullableUuid(Object rawValue, String fieldName) {
        if (rawValue == null) {
            return null;
        }
        return parseRequiredUuid(rawValue, fieldName);
    }

    public LocalDateTime parseDateTime(String rawValue, String fieldName) {
        if (rawValue == null || rawValue.isBlank()) {
            throw new IllegalArgumentException("Date-time value for " + fieldName + " cannot be empty");
        }

        try {
            return LocalDateTime.parse(rawValue);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid date-time format for " + fieldName + ": " + rawValue);
        }
    }

    public Set<String> parseStringSet(Object rawValue, String fieldName) {
        if (rawValue == null) {
            return new HashSet<>();
        }

        if (!(rawValue instanceof Collection<?> collection)) {
            throw new IllegalArgumentException("Invalid collection value for " + fieldName + ": " + rawValue);
        }

        Set<String> values = new HashSet<>();
        for (Object item : collection) {
            if (item == null) {
                continue;
            }

            String text = String.valueOf(item).trim();
            if (!text.isEmpty()) {
                values.add(text);
            }
        }
        return values;
    }

    public Map<String, Object> parseMap(Object rawValue, String fieldName) {
        if (rawValue == null) {
            return new HashMap<>();
        }

        if (!(rawValue instanceof Map<?, ?> rawMap)) {
            throw new IllegalArgumentException("Invalid map value for " + fieldName + ": " + rawValue);
        }

        Map<String, Object> parsed = new HashMap<>();
        for (Map.Entry<?, ?> entry : rawMap.entrySet()) {
            if (entry.getKey() == null) {
                continue;
            }
            parsed.put(String.valueOf(entry.getKey()), entry.getValue());
        }
        return parsed;
    }
}
