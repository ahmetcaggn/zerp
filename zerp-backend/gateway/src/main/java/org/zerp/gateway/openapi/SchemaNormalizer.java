package org.zerp.gateway.openapi;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.media.Schema;
import org.springframework.stereotype.Component;

/**
 * Normalizes schemas that are missing explicit {@code type} fields.
 * <p>
 * Some OpenAPI generators omit the {@code type} keyword when it can be inferred.
 * This class fills in the gaps so downstream tooling (Swagger UI, code generators)
 * doesn't choke on technically-valid-but-ambiguous schemas.
 */
@Component
public class SchemaNormalizer {

    /**
     * Normalizes all schemas in the given OpenAPI components.
     */
    public void normalizeComponentSchemas(Components components) {
        if (components == null || components.getSchemas() == null) {
            return;
        }
        components.getSchemas().values().forEach(this::normalizeRecursive);
    }

    /**
     * Recursively sets missing {@code type} on a schema tree.
     * <ul>
     *   <li>If properties are present but type is null → sets type to "object"</li>
     *   <li>If items is present but type is null → sets type to "array"</li>
     * </ul>
     */
    private void normalizeRecursive(Schema<?> schema) {
        if (schema == null) {
            return;
        }

        if (schema.getType() == null && schema.getProperties() != null && !schema.getProperties().isEmpty()) {
            schema.setType("object");
        }
        if (schema.getType() == null && schema.getItems() != null) {
            schema.setType("array");
        }

        if (schema.getProperties() != null) {
            schema.getProperties().values().forEach(
                    propertySchema -> normalizeRecursive((Schema<?>) propertySchema));
        }

        normalizeRecursive(schema.getItems());
        normalizeRecursive(extractAdditionalPropertiesSchema(schema.getAdditionalProperties()));

        if (schema.getAllOf() != null) {
            schema.getAllOf().forEach(this::normalizeRecursive);
        }
        if (schema.getAnyOf() != null) {
            schema.getAnyOf().forEach(this::normalizeRecursive);
        }
        if (schema.getOneOf() != null) {
            schema.getOneOf().forEach(this::normalizeRecursive);
        }
        normalizeRecursive(schema.getNot());
    }

    private Schema<?> extractAdditionalPropertiesSchema(Object additionalProperties) {
        return additionalProperties instanceof Schema<?> additionalSchema ? additionalSchema : null;
    }
}
