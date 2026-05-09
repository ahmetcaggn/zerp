package org.zerp.gateway.openapi;

import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.Components;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Content-based deduplication for OpenAPI component sections.
 * <p>
 * When two services contribute a component with the same key:
 * <ul>
 *   <li>If the content is structurally identical (deep JSON equality) → reuse the existing entry</li>
 *   <li>If the content differs → namespace the incoming entry ({serviceKey}_{originalKey})
 *       and log an error</li>
 * </ul>
 */
@Log4j2
@Component
public class SchemaDeduplicator {

    /**
     * Result of deduplicating a service's components against the merged result.
     *
     * @param refMappings               old $ref → new $ref for any renamed components
     * @param securitySchemeNameMapping old security scheme name → new name (for SecurityRequirement rewriting)
     */
    public record DeduplicationResult(
            Map<String, String> refMappings,
            Map<String, String> securitySchemeNameMapping
    ) {
        public static DeduplicationResult empty() {
            return new DeduplicationResult(Map.of(), Map.of());
        }
    }

    /**
     * Deduplicates a service's components into the merged components.
     * <p>
     * For each component section, keys that already exist in the merged result are
     * compared by content. Identical entries are skipped; differing entries are
     * namespaced and a ref mapping is recorded.
     *
     * @param mergedComponents  the accumulated merged components (mutated)
     * @param serviceComponents the incoming service's components
     * @param serviceKey        lowercase identifier for the service (used in namespacing)
     * @param serviceName       human-readable service name (used in error messages)
     * @return the ref mappings and security scheme name mappings needed for downstream rewriting
     */
    public DeduplicationResult deduplicate(
            Components mergedComponents,
            Components serviceComponents,
            String serviceKey,
            String serviceName) {

        if (serviceComponents == null) {
            return DeduplicationResult.empty();
        }

        Map<String, String> refMappings = new LinkedHashMap<>();
        Map<String, String> securitySchemeNameMapping = new LinkedHashMap<>();

        deduplicateSection(
                mergedComponents.getSchemas(), serviceComponents.getSchemas(),
                "schemas", serviceKey, serviceName, refMappings,
                mergedComponents::setSchemas,
                serviceComponents::setSchemas);

        deduplicateSection(
                mergedComponents.getResponses(), serviceComponents.getResponses(),
                "responses", serviceKey, serviceName, refMappings,
                mergedComponents::setResponses,
                serviceComponents::setResponses);

        deduplicateSection(
                mergedComponents.getParameters(), serviceComponents.getParameters(),
                "parameters", serviceKey, serviceName, refMappings,
                mergedComponents::setParameters,
                serviceComponents::setParameters);

        deduplicateSection(
                mergedComponents.getExamples(), serviceComponents.getExamples(),
                "examples", serviceKey, serviceName, refMappings,
                mergedComponents::setExamples,
                serviceComponents::setExamples);

        deduplicateSection(
                mergedComponents.getRequestBodies(), serviceComponents.getRequestBodies(),
                "requestBodies", serviceKey, serviceName, refMappings,
                mergedComponents::setRequestBodies,
                serviceComponents::setRequestBodies);

        deduplicateSection(
                mergedComponents.getHeaders(), serviceComponents.getHeaders(),
                "headers", serviceKey, serviceName, refMappings,
                mergedComponents::setHeaders,
                serviceComponents::setHeaders);

        deduplicateSection(
                mergedComponents.getLinks(), serviceComponents.getLinks(),
                "links", serviceKey, serviceName, refMappings,
                mergedComponents::setLinks,
                serviceComponents::setLinks);

        deduplicateSection(
                mergedComponents.getCallbacks(), serviceComponents.getCallbacks(),
                "callbacks", serviceKey, serviceName, refMappings,
                mergedComponents::setCallbacks,
                serviceComponents::setCallbacks);

        deduplicateSection(
                mergedComponents.getPathItems(), serviceComponents.getPathItems(),
                "pathItems", serviceKey, serviceName, refMappings,
                mergedComponents::setPathItems,
                serviceComponents::setPathItems);

        deduplicateSecuritySchemes(
                mergedComponents, serviceComponents,
                serviceKey, serviceName, refMappings, securitySchemeNameMapping);

        return new DeduplicationResult(refMappings, securitySchemeNameMapping);
    }

    /**
     * Merges the deduplicated service components into the merged components.
     * Called after deduplication and ref-rewriting are complete.
     */
    public void mergeDeduplicatedComponents(Components mergedComponents, Components serviceComponents) {
        if (serviceComponents == null) {
            return;
        }
        mergeMaps(mergedComponents.getSchemas(), serviceComponents.getSchemas(),
                mergedComponents::setSchemas);
        mergeMaps(mergedComponents.getResponses(), serviceComponents.getResponses(),
                mergedComponents::setResponses);
        mergeMaps(mergedComponents.getParameters(), serviceComponents.getParameters(),
                mergedComponents::setParameters);
        mergeMaps(mergedComponents.getExamples(), serviceComponents.getExamples(),
                mergedComponents::setExamples);
        mergeMaps(mergedComponents.getRequestBodies(), serviceComponents.getRequestBodies(),
                mergedComponents::setRequestBodies);
        mergeMaps(mergedComponents.getHeaders(), serviceComponents.getHeaders(),
                mergedComponents::setHeaders);
        mergeMaps(mergedComponents.getSecuritySchemes(), serviceComponents.getSecuritySchemes(),
                mergedComponents::setSecuritySchemes);
        mergeMaps(mergedComponents.getLinks(), serviceComponents.getLinks(),
                mergedComponents::setLinks);
        mergeMaps(mergedComponents.getCallbacks(), serviceComponents.getCallbacks(),
                mergedComponents::setCallbacks);
        mergeMaps(mergedComponents.getPathItems(), serviceComponents.getPathItems(),
                mergedComponents::setPathItems);
    }

    // ---- internals ----

    @FunctionalInterface
    private interface MapSetter<T> {
        void set(Map<String, T> map);
    }

    private <T> void deduplicateSection(
            Map<String, T> mergedSection,
            Map<String, T> serviceSection,
            String sectionName,
            String serviceKey,
            String serviceName,
            Map<String, String> refMappings,
            MapSetter<T> mergedSetter,
            MapSetter<T> serviceSetter) {

        if (serviceSection == null || serviceSection.isEmpty()) {
            return;
        }

        // Ensure the merged side has a map
        if (mergedSection == null) {
            mergedSection = new LinkedHashMap<>();
            mergedSetter.set(mergedSection);
        }

        Map<String, T> deduplicatedService = new LinkedHashMap<>();
        final Map<String, T> effectiveMerged = mergedSection;

        for (Map.Entry<String, T> entry : serviceSection.entrySet()) {
            String originalKey = entry.getKey();
            T incomingValue = entry.getValue();

            if (effectiveMerged.containsKey(originalKey)) {
                // Key collision — compare content
                T existingValue = effectiveMerged.get(originalKey);
                if (isStructurallyEqual(existingValue, incomingValue)) {
                    // Identical — skip (reuse existing, no ref mapping needed)
                    continue;
                }

                // Different content — namespace and log error
                String namespacedKey = serviceKey + "_" + originalKey;
                log.error("Schema conflict in components.{}: key '{}' from service '{}' differs from existing entry. "
                                + "Namespacing as '{}'.",
                        sectionName, originalKey, serviceName, namespacedKey);
                deduplicatedService.put(namespacedKey, incomingValue);
                refMappings.put(
                        "#/components/" + sectionName + "/" + originalKey,
                        "#/components/" + sectionName + "/" + namespacedKey);
            } else {
                // No collision — add as-is
                deduplicatedService.put(originalKey, incomingValue);
            }
        }

        serviceSetter.set(deduplicatedService);
    }

    private void deduplicateSecuritySchemes(
            Components mergedComponents,
            Components serviceComponents,
            String serviceKey,
            String serviceName,
            Map<String, String> refMappings,
            Map<String, String> securitySchemeNameMapping) {

        var serviceSchemes = serviceComponents.getSecuritySchemes();
        if (serviceSchemes == null || serviceSchemes.isEmpty()) {
            return;
        }

        var mergedSchemes = mergedComponents.getSecuritySchemes();
        if (mergedSchemes == null) {
            mergedSchemes = new LinkedHashMap<>();
            mergedComponents.setSecuritySchemes(mergedSchemes);
        }

        var deduplicatedService = new LinkedHashMap<String, io.swagger.v3.oas.models.security.SecurityScheme>();

        for (var entry : serviceSchemes.entrySet()) {
            String originalKey = entry.getKey();
            var incomingValue = entry.getValue();

            if (mergedSchemes.containsKey(originalKey)) {
                var existingValue = mergedSchemes.get(originalKey);
                if (isStructurallyEqual(existingValue, incomingValue)) {
                    // Identical — reuse
                    continue;
                }

                String namespacedKey = serviceKey + "_" + originalKey;
                log.error("Security scheme conflict: key '{}' from service '{}' differs from existing entry. "
                                + "Namespacing as '{}'.",
                        originalKey, serviceName, namespacedKey);
                deduplicatedService.put(namespacedKey, incomingValue);
                securitySchemeNameMapping.put(originalKey, namespacedKey);
                refMappings.put(
                        "#/components/securitySchemes/" + originalKey,
                        "#/components/securitySchemes/" + namespacedKey);
            } else {
                deduplicatedService.put(originalKey, incomingValue);
            }
        }

        serviceComponents.setSecuritySchemes(deduplicatedService);
    }

    private <T> void mergeMaps(Map<String, T> target, Map<String, T> source, MapSetter<T> setter) {
        if (source == null || source.isEmpty()) {
            return;
        }
        Map<String, T> effectiveTarget = target;
        if (effectiveTarget == null) {
            effectiveTarget = new LinkedHashMap<>();
            setter.set(effectiveTarget);
        }
        effectiveTarget.putAll(source);
    }

    /**
     * Compares two objects for structural equality by serializing to JSON and comparing the trees.
     */
    private boolean isStructurallyEqual(Object a, Object b) {
        if (a == b) return true;
        if (a == null || b == null) return false;
        try {
            return Json.mapper().valueToTree(a).equals(Json.mapper().valueToTree(b));
        } catch (Exception e) {
            log.warn("Failed to compare schemas for structural equality, treating as different", e);
            return false;
        }
    }
}
