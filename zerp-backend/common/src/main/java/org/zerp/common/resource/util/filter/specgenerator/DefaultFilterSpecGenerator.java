package org.zerp.common.resource.util.filter.specgenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.resource.util.filter.FilterOperator;
import org.zerp.common.resource.util.filter.FilterProcessor;

import java.util.List;

@Log4j2
@Component
@RequiredArgsConstructor
public class DefaultFilterSpecGenerator<T> implements IFilterSpecGenerator<T> {
    private final FilterProcessor filterProcessor;

    @Override
    public Specification<T> generateSpecification(List<String> parts, FilterOperator operator, String value) {
        log.debug("Generating default specification: parts={}, operator={}, value={}", parts, operator, value);

        Specification<T> specification = (root, query, cb) -> {
            log.trace("Executing default specification predicate: field={}", String.join(".", parts));
            return filterProcessor.generatePredicate(parts, value, operator, root, query, cb);
        };

        log.debug("Default specification generated successfully");
        return specification;
    }

    @Override
    public Specification<T> generateGlobalSearchSpecification(String value) {
        log.debug("Global search is not supported by DefaultFilterSpecGenerator. Returning unrestricted specification for value={}.", value);
        return Specification.unrestricted();
    }
}
