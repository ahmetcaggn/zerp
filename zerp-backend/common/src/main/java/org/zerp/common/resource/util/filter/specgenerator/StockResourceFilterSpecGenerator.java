package org.zerp.common.resource.util.filter.specgenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.resource.util.filter.FilterOperator;
import org.zerp.common.resource.util.filter.FilterProcessor;

import java.util.List;

@Log4j2
@Component
@RequiredArgsConstructor
public class StockResourceFilterSpecGenerator implements IFilterSpecGenerator<StockResource> {
    private final FilterProcessor filterProcessor;

    @Override
    public Specification<StockResource> generateSpecification(List<String> parts, FilterOperator operator, String value) {
        log.debug("Generating StockResource specification: parts={}, operator={}, value={}", parts, operator, value);

        if (parts.isEmpty()) {
            log.warn("Empty parts list provided to StockResource filter spec generator");
            return Specification.unrestricted();
        }

        String field = parts.getFirst();

        // Global search - delegate to dedicated method
        if ("q".equals(field)) {
            log.debug("Detected global search filter for StockResource: value={}", value);
            return generateGlobalSearchSpecification(value);
        }

        // Standard field-based filter
        log.trace("Generating standard filter for StockResource field: field={}, operator={}", field, operator);
        return (root, query, cb) ->
                filterProcessor.generatePredicate(parts, value, operator, root, query, cb);
    }

    @Override
    public Specification<StockResource> generateGlobalSearchSpecification(String value) {
        if (value == null || value.isBlank()) {
            log.debug("Global search value is blank, returning unrestricted specification");
            return Specification.unrestricted();
        }

        String pattern = "%" + value.toLowerCase() + "%";
        log.debug("Generating global search for StockResource: searchFields=[name], pattern={}%...%",
                value.toLowerCase());

        return (root, _, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern)
        );
    }
}
