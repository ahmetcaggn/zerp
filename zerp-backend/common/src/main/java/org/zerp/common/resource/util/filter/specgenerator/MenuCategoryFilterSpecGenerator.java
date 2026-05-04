package org.zerp.common.resource.util.filter.specgenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.sale.MenuCategory;
import org.zerp.common.resource.util.filter.FilterOperator;
import org.zerp.common.resource.util.filter.FilterProcessor;

import java.util.List;

@Log4j2
@Component
@RequiredArgsConstructor
public class MenuCategoryFilterSpecGenerator implements IFilterSpecGenerator<MenuCategory> {
    private final FilterProcessor filterProcessor;

    @Override
    public Specification<MenuCategory> generateSpecification(List<String> parts, FilterOperator operator, String value) {
        log.debug("Generating MenuCategory specification: parts={}, operator={}, value={}", parts, operator, value);

        if (parts.isEmpty()) {
            return Specification.unrestricted();
        }

        if ("q".equals(parts.getFirst())) {
            return generateGlobalSearchSpecification(value);
        }

        return (root, query, cb) -> filterProcessor.generatePredicate(parts, value, operator, root, query, cb);
    }

    @Override
    public Specification<MenuCategory> generateGlobalSearchSpecification(String value) {
        if (value == null || value.isBlank()) {
            return Specification.unrestricted();
        }

        String pattern = "%" + value.toLowerCase() + "%";
        return (root, _, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("description")), pattern)
        );
    }
}
