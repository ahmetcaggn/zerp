package org.zerp.gateway.openapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Rewrites {@code $ref} values throughout an OpenAPI document tree.
 * <p>
 * Operates on the Jackson {@link JsonNode} representation to ensure every
 * {@code $ref} — regardless of nesting depth — is updated according to the
 * provided mapping.
 */
@Component
public class RefRewriter {

    /**
     * Rewrites all {@code $ref} values in the given OpenAPI object according to the mapping.
     * Mutates the object in place by serializing to JSON, rewriting, and deserializing back.
     *
     * @param serviceApi  the OpenAPI object to rewrite (mutated in place)
     * @param refMappings old ref → new ref mappings; unmapped refs are left as-is
     */
    public void rewriteRefs(OpenAPI serviceApi, Map<String, String> refMappings) {
        if (refMappings.isEmpty()) {
            return;
        }
        JsonNode root = Json.mapper().valueToTree(serviceApi);
        rewriteRefsRecursive(root, refMappings);
        OpenAPI rewritten = Json.mapper().convertValue(root, OpenAPI.class);
        serviceApi.setPaths(rewritten.getPaths());
        serviceApi.setComponents(rewritten.getComponents());
        serviceApi.setTags(rewritten.getTags());
        serviceApi.setServers(rewritten.getServers());
        serviceApi.setSecurity(rewritten.getSecurity());
        serviceApi.setWebhooks(rewritten.getWebhooks());
    }

    private void rewriteRefsRecursive(JsonNode node, Map<String, String> refMappings) {
        if (node == null) {
            return;
        }
        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            JsonNode refNode = objectNode.get("$ref");
            if (refNode != null && refNode.isTextual()) {
                String ref = refNode.asText();
                objectNode.put("$ref", refMappings.getOrDefault(ref, ref));
            }
            objectNode.properties().forEach(field -> rewriteRefsRecursive(field.getValue(), refMappings));
            return;
        }
        if (node.isArray()) {
            ArrayNode arrayNode = (ArrayNode) node;
            arrayNode.forEach(child -> rewriteRefsRecursive(child, refMappings));
        }
    }
}
