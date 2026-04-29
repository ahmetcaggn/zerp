package org.zerp.common.resource.util.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TicketEntity;
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.resource.util.filter.specgenerator.*;

import jakarta.annotation.PostConstruct;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@Component
@RequiredArgsConstructor
public class FilterRefiner {
    private final DefaultFilterSpecGenerator<?> defaultFilterSpecGenerator;

    // CRM
    private final TicketFilterSpecGenerator ticketFilterSpecGenerator;
    private final TeamFilterSpecGenerator teamFilterSpecGenerator;

    // Employee
    private final EmployeeFilterSpecGenerator employeeFilterSpecGenerator;

    // Resource
    private final StockResourceFilterSpecGenerator stockResourceFilterSpecGenerator;

    /**
     * Generic entity type to its dedicated spec generator.
     * Initialized lazily in @PostConstruct after all dependencies are injected.
     */
    private Map<Class<?>, IFilterSpecGenerator<?>> specGeneratorMap;

    /**
     * Initialize the spec generator map after all dependencies are injected.
     * This ensures no NullPointerException due to constructor injection timing.
     */
    @PostConstruct
    private void initializeSpecGeneratorMap() {
        log.debug("Initializing spec generator map with registered generators");
        this.specGeneratorMap = new HashMap<>();

        specGeneratorMap.put(TicketEntity.class, ticketFilterSpecGenerator);
        log.trace("Registered spec generator: TicketEntity -> {}", ticketFilterSpecGenerator.getClass().getSimpleName());

        specGeneratorMap.put(TeamEntity.class, teamFilterSpecGenerator);
        log.trace("Registered spec generator: TeamEntity -> {}", teamFilterSpecGenerator.getClass().getSimpleName());

        specGeneratorMap.put(Employee.class, employeeFilterSpecGenerator);
        log.trace("Registered spec generator: Employee -> {}", employeeFilterSpecGenerator.getClass().getSimpleName());

        specGeneratorMap.put(StockResource.class, stockResourceFilterSpecGenerator);
        log.trace("Registered spec generator: StockResource -> {}", stockResourceFilterSpecGenerator.getClass().getSimpleName());

        log.info("Spec generator map initialized with {} generators", specGeneratorMap.size());
    }

    public <T> Specification<T> refined(Map<String, String> filter, Class<T> entityClass) {
        @SuppressWarnings("unchecked") final IFilterSpecGenerator<T> specGenerator = (IFilterSpecGenerator<T>) specGeneratorMap
                .getOrDefault(entityClass, defaultFilterSpecGenerator);

        log.info("Starting filter refinement: entityType={}, filterCount={}, specGenerator={}",
                entityClass.getSimpleName(), filter.size(), specGenerator.getClass().getSimpleName());
        log.debug("Filter details: filters={}", filter);

        Specification<T> specification = Specification.unrestricted();
        int appliedFilters = 0;
        int skippedFilters = 0;

        for (Map.Entry<String, String> entry : filter.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if (value.isBlank()) {
                log.trace("Skipping filter with blank value: key={}", key);
                skippedFilters++;
                continue;
            }
            if (key.isBlank()) {
                log.trace("Skipping filter with blank key: value={}", value);
                skippedFilters++;
                continue;
            }

            List<String> parts = new ArrayList<>(Arrays.asList(key.split("\\.")));
            String last = parts.getLast();
            FilterOperator filterOperator = FilterOperator.fromKey(last);

            if (filterOperator != FilterOperator.NONE) {
                parts.removeLast();
                log.debug("Applying filter with explicit operator: field={}, operator={}, value={}",
                        String.join(".", parts), filterOperator, value);
            } else {
                filterOperator = FilterOperator.EQUALS;
                log.debug("Applying filter with default EQUALS operator: field={}, value={}",
                        String.join(".", parts), value);
            }

            try {
                if (parts.getFirst().equals("q")) {
                    log.debug("Detected global search filter: value={}", value);
                    specification = specification.and(specGenerator.generateGlobalSearchSpecification(value));
                } else {
                    log.debug("Generating specification for filter: field={}, operator={}, value={}",
                            String.join(".", parts), filterOperator, value);
                    specification = specification.and(specGenerator.generateSpecification(parts, filterOperator, value));
                }

                appliedFilters++;
                log.trace("Filter applied successfully: field={}, operator={}",
                        String.join(".", parts), filterOperator);
            } catch (Exception e) {
                log.error("Failed to generate specification for filter: key={}, value={}, error={}",
                        key, value, e.getMessage(), e);
                throw e;
            }
        }

        log.info("Filter refinement completed: applied={}, skipped={}, total={}, entityType={}",
                appliedFilters, skippedFilters, filter.size(), entityClass.getSimpleName());
        return specification;
    }
}
