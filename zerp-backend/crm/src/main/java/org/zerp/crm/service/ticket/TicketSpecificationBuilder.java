package org.zerp.crm.service.ticket;

import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.entity.crm.TicketEntity.TicketPriority;
import org.zerp.common.entity.crm.TicketEntity.TicketStatus;
import org.zerp.common.entity.crm.TicketEntity.TicketType;
import org.zerp.common.resource.util.FilterType;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Component
public class TicketSpecificationBuilder {

    private final TicketValueParser ticketValueParser;

    public TicketSpecificationBuilder(TicketValueParser ticketValueParser) {
        this.ticketValueParser = ticketValueParser;
    }

    public Specification<TicketEntity> build(Map<String, String> filters) {
        Specification<TicketEntity> specification = Specification.unrestricted();

        if (filters == null || filters.isEmpty()) {
            return specification;
        }

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if ("q".equalsIgnoreCase(key) && value != null && !value.isBlank()) {
                specification = specification.and((root, _, cb) -> cb.or(
                        cb.like(cb.lower(root.get("title")), "%" + value.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + value.toLowerCase() + "%")
                ));
                log.debug("Applied global search filter (q): {}", value);
                continue;
            }

            int separatorIndex = key.lastIndexOf('.');
            if (separatorIndex < 0 || separatorIndex == key.length() - 1) {
                log.warn("Invalid filter key format (missing filter type): {}", key);
                continue;
            }

            String field = key.substring(0, separatorIndex);
            FilterType filterType = FilterType.fromCode(key.substring(separatorIndex + 1));
            if (filterType == null) {
                log.warn("Unsupported filter type in key: {}", key);
                continue;
            }

            specification = specification.and((root, _, cb) -> {
                if ("title".equals(field) || "description".equals(field)) {
                    if (filterType == FilterType.EQUAL) {
                        return cb.equal(root.get(field), value);
                    }
                    if (filterType == FilterType.NOT_EQUAL) {
                        return cb.notEqual(root.get(field), value);
                    }
                    if (filterType == FilterType.LIKE) {
                        return cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%");
                    }
                }

                if ("status".equals(field)) {
                    TicketStatus status = ticketValueParser.parseStatus(value, key);
                    if (filterType == FilterType.NOT_EQUAL) {
                        return cb.notEqual(root.get(field), status);
                    }
                    if (filterType == FilterType.EQUAL) {
                        return cb.equal(root.get(field), status);
                    }
                }

                if ("priority".equals(field)) {
                    TicketPriority priority = ticketValueParser.parsePriority(value, key);
                    if (filterType == FilterType.NOT_EQUAL) {
                        return cb.notEqual(root.get(field), priority);
                    }
                    if (filterType == FilterType.EQUAL) {
                        return cb.equal(root.get(field), priority);
                    }
                }

                if ("type".equals(field)) {
                    TicketType type = ticketValueParser.parseType(value, key);
                    if (filterType == FilterType.NOT_EQUAL) {
                        return cb.notEqual(root.get(field), type);
                    }
                    if (filterType == FilterType.EQUAL) {
                        return cb.equal(root.get(field), type);
                    }
                }

                if ("tenantId".equals(field) || "reporterId".equals(field)) {
                    UUID uuid = ticketValueParser.parseRequiredUuid(value, key);
                    if (filterType == FilterType.NOT_EQUAL) {
                        return cb.notEqual(root.get(field), uuid);
                    }
                    if (filterType == FilterType.EQUAL) {
                        return cb.equal(root.get(field), uuid);
                    }
                }

                if ("createdAt".equals(field) || "updatedAt".equals(field)
                        || "resolvedAt".equals(field) || "closedAt".equals(field)) {
                    LocalDateTime dateTime = ticketValueParser.parseDateTime(value, key);
                    if (filterType == FilterType.EQUAL) {
                        return cb.equal(root.get(field), dateTime);
                    }
                    if (filterType == FilterType.NOT_EQUAL) {
                        return cb.notEqual(root.get(field), dateTime);
                    }
                    if (filterType == FilterType.GREATER_THAN_OR_EQUAL) {
                        return cb.greaterThanOrEqualTo(root.get(field), dateTime);
                    }
                    if (filterType == FilterType.LESS_THAN_OR_EQUAL) {
                        return cb.lessThanOrEqualTo(root.get(field), dateTime);
                    }
                }

                log.warn("Unsupported filter field or type for key: {}. This filter will be ignored.", key);
                return cb.conjunction();
            });
        }

        return specification;
    }
}
