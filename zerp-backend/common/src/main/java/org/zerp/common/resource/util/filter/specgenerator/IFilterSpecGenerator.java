package org.zerp.common.resource.util.filter.specgenerator;

import org.springframework.data.jpa.domain.Specification;
import org.zerp.common.resource.util.filter.FilterOperator;

import java.util.List;

/**
 * Interface for generating JPA Specifications for filtering entity fields.
 *
 * @param <T> the type of the entity
 */
public interface IFilterSpecGenerator<T> {
    /**
     * Generates a JPA Specification based on the provided field parts, operator, and value.
     *
     * <p><b>Example Implementation (Product Filter with Dual-Path Search):</b></p>
     *
     * <pre>{@code
     * @Override
     * public <T> Specification<T> generateSpecification(List<String> parts,
     *                                                     FilterOperator operator,
     *                                                     String value) {
     *     final List<String> partsForTemplate;
     *
     *     // Step 1: Handle special field cases
     *     switch (parts.getFirst()) {
     *         case "onlyFromTemplate" -> {
     *             boolean isTrue = value.equalsIgnoreCase("true");
     *             return (root, query, cb) -> {
     *                 if (isTrue) return root.get("productTemplate").isNotNull();
     *                 return cb.conjunction();
     *             };
     *         }
     *         case "fromTemplate" -> {
     *             boolean isTrue = value.equalsIgnoreCase("true");
     *             return (root, query, cb) -> {
     *                 if (isTrue) return cb.isNotNull(root.get("productTemplate"));
     *                 return cb.isNull(root.get("productTemplate"));
     *             };
     *         }
     *         case "template" -> parts.set(0, "productTemplate");
     *     }
     *
     *     // Step 2: Determine search paths (direct path + template path)
     *     if (!parts.getFirst().equals("category") &&
     *         !parts.getFirst().equals("productTemplate")) {
     *         partsForTemplate = new ArrayList<>(parts);
     *         partsForTemplate.addFirst("productTemplate");
     *         log.debug("Enabling dual-path search: directPath={}, templatePath={}",
     *             String.join(".", parts), String.join(".", partsForTemplate));
     *     } else {
     *         partsForTemplate = null;
     *         log.debug("Single-path search: field={}", parts.getFirst());
     *     }
     *
     *     // Step 3: Create specifications
     *     final Specification<T> specification;
     *     if (partsForTemplate == null) {
     *         // Single-path: direct field access
     *         specification = (root, query, cb) ->
     *             filterProcessor.generatePredicate(parts, value, operator,
     *                                                 root, query, cb);
     *     } else {
     *         // Dual-path: search in both direct and template paths with OR logic
     *         specification = Specification.anyOf(
     *             (root, query, cb) -> {
     *                 log.trace("Evaluating direct path: field={}",
     *                     String.join(".", parts));
     *                 return filterProcessor.generatePredicate(parts, value,
     *                     operator, root, query, cb);
     *             },
     *             (root, query, cb) -> {
     *                 log.trace("Evaluating template path: field={}",
     *                     String.join(".", partsForTemplate));
     *                 return filterProcessor.generatePredicate(partsForTemplate,
     *                     value, operator, root, query, cb);
     *             }
     *         );
     *     }
     *
     *     log.debug("Product specification generated: parts={}", parts);
     *     return specification;
     * }
     * }</pre>
     *
     * @param parts    the list of field parts representing the path to the field (e.g., ["category", "name"])
     * @param operator the filter operator (e.g., EQUALS, CONTAINS)
     * @param value    the value to filter by
     * @return a Specification representing the filter criteria
     */
    Specification<T> generateSpecification(List<String> parts, FilterOperator operator, String value);

    /**
     * Generates a global search Specification that applies the given value across multiple fields.
     *
     * @param value the search term to apply globally
     * @return a Specification that performs a global search using the provided value
     */
    Specification<T> generateGlobalSearchSpecification(String value);
}
