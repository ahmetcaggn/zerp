package org.zerp.common.resource.util.filter.specgenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.resource.util.filter.FilterOperator;
import org.zerp.common.resource.util.filter.FilterProcessor;

import java.util.List;

@Log4j2
@Component
@RequiredArgsConstructor
public class TicketFilterSpecGenerator implements IFilterSpecGenerator<TicketEntity> {
    private final FilterProcessor filterProcessor;

    @Override
    public Specification<TicketEntity> generateSpecification(List<String> parts, FilterOperator operator, String value) {
        log.debug("Generating Ticket specification: parts={}, operator={}, value={}", parts, operator, value);

        if (parts.isEmpty()) {
            log.warn("Empty parts list provided to Ticket filter spec generator");
            return Specification.unrestricted();
        }

        String field = parts.getFirst();

        // Global search - delegate to dedicated method
        if ("q".equals(field)) {
            log.debug("Detected global search filter for Ticket: value={}", value);
            return generateGlobalSearchSpecification(value);
        }

        // Standard field-based filter
        log.trace("Generating standard filter for Ticket field: field={}, operator={}", field, operator);
        return (root, query, cb) ->
                filterProcessor.generatePredicate(parts, value, operator, root, query, cb);
    }

    @Override
    public Specification<TicketEntity> generateGlobalSearchSpecification(String value) {
        if (value == null || value.isBlank()) {
            log.debug("Global search value is blank, returning unrestricted specification");
            return Specification.unrestricted();
        }

        String pattern = "%" + value.toLowerCase() + "%";
        log.debug("Generating global search for Ticket: searchFields=[title, description], pattern={}%...%",
                value.toLowerCase());

        return (root, _, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), pattern),
                cb.like(cb.lower(root.get("description")), pattern)
        );
    }
}

