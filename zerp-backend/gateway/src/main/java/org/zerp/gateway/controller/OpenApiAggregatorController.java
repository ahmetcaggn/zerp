package org.zerp.gateway.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.swagger.parser.OpenAPIParser;
import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.parser.core.models.SwaggerParseResult;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/gateway")
public class OpenApiAggregatorController {
    private static final List<ServiceDoc> MICROSERVICE_DOCS = List.of(
            new ServiceDoc("CRM", "/crm", "/crm/v3/api-docs"),
            new ServiceDoc("Employee", "/employee", "/employee/v3/api-docs"),
            new ServiceDoc("Notification", "/notification", "/notification/v3/api-docs")
    );

    @GetMapping(value = "/v3/api-docs/merged", produces = "application/json")
    public String getMergedDocs(ServerHttpRequest request) {
        OpenAPI mergedApi = new OpenAPI();
        mergedApi.setOpenapi("3.0.1");
        mergedApi.setInfo(new Info().title("Central API Gateway Documentation").version("1.0.0"));
        mergedApi.setPaths(new Paths());
        mergedApi.setComponents(new Components());
        Set<String> usedOperationIds = new HashSet<>();
        Set<String> usedTagNames = new HashSet<>();
        Set<String> usedServerUrls = new HashSet<>();

        String gatewayBaseUrl = buildGatewayBaseUrl(request.getURI());

        for (ServiceDoc serviceDoc : MICROSERVICE_DOCS) {
            String docsUrl = gatewayBaseUrl + serviceDoc.docsPath();
            SwaggerParseResult parseResult = new OpenAPIParser().readLocation(docsUrl, null, null);
            ensureParseSucceeded(serviceDoc, docsUrl, parseResult);
            OpenAPI serviceApi = parseResult.getOpenAPI();

            if (serviceApi != null) {
                String serviceKey = toIdentifierPart(serviceDoc.name());
                normalizeSchemaTypes(serviceApi);
                NamespaceResult namespaceResult = namespaceComponentKeys(serviceApi, serviceKey);
                rewriteComponentRefs(serviceApi, namespaceResult.refMappings());
                renameSecurityRequirements(serviceApi, namespaceResult.securitySchemeNameMapping());
                mergePaths(mergedApi, serviceApi, serviceDoc, usedOperationIds);
                mergeComponents(mergedApi, serviceApi);
                mergeTags(mergedApi, serviceApi, usedTagNames);
                mergeServers(mergedApi, serviceApi, usedServerUrls);
                mergeSecurity(mergedApi, serviceApi);
                mergeExternalDocs(mergedApi, serviceApi);
                mergeWebhooks(mergedApi, serviceApi);
                mergeExtensions(mergedApi, serviceApi);
            }
        }

        try {
            return Json.mapper().writerWithDefaultPrettyPrinter().writeValueAsString(mergedApi);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize merged OpenAPI specification", e);
        }
    }

    private void mergePaths(OpenAPI mergedApi, OpenAPI serviceApi, ServiceDoc serviceDoc, Set<String> usedOperationIds) {
        if (serviceApi.getPaths() != null) {
            serviceApi.getPaths().forEach((pathName, pathItem) -> {
                String mergedPath = resolveMergedPath(serviceDoc.routePrefix(), pathName);
                if (mergedApi.getPaths().containsKey(mergedPath)) {
                    throw new IllegalStateException("Duplicate merged path detected: " + mergedPath);
                }
                if (pathItem.readOperationsMap() != null) {
                    pathItem.readOperationsMap().forEach((httpMethod, operation) -> {
                        String operationId = StringUtils.hasText(operation.getOperationId())
                                ? operation.getOperationId()
                                : httpMethod.name().toLowerCase(Locale.ROOT) + "_" + toIdentifierPart(mergedPath);
                        String namespacedId = toIdentifierPart(serviceDoc.name()) + "_" + toIdentifierPart(operationId);
                        operation.setOperationId(makeUniqueOperationId(namespacedId, usedOperationIds));
                    });
                }
                mergedApi.getPaths().addPathItem(mergedPath, pathItem);
            });
        }
    }

    private void ensureParseSucceeded(ServiceDoc serviceDoc, String docsUrl, SwaggerParseResult parseResult) {
        if (parseResult == null || parseResult.getOpenAPI() == null) {
            throw new IllegalStateException("Failed to parse OpenAPI docs for " + serviceDoc.name() + " from " + docsUrl);
        }
        if (parseResult.getMessages() != null && !parseResult.getMessages().isEmpty()) {
            throw new IllegalStateException("OpenAPI parse issues for " + serviceDoc.name() + ": " + String.join(" | ", parseResult.getMessages()));
        }
    }

    private void normalizeSchemaTypes(OpenAPI serviceApi) {
        Components components = serviceApi.getComponents();
        if (components == null || components.getSchemas() == null) {
            return;
        }
        components.getSchemas().values().forEach(this::normalizeSchemaTypeRecursive);
    }

    private void normalizeSchemaTypeRecursive(Schema<?> schema) {
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
            schema.getProperties().values().forEach(propertySchema -> normalizeSchemaTypeRecursive((Schema<?>) propertySchema));
        }

        normalizeSchemaTypeRecursive(schema.getItems());
        normalizeSchemaTypeRecursive(extractAdditionalPropertiesSchema(schema.getAdditionalProperties()));

        if (schema.getAllOf() != null) {
            schema.getAllOf().forEach(this::normalizeSchemaTypeRecursive);
        }
        if (schema.getAnyOf() != null) {
            schema.getAnyOf().forEach(this::normalizeSchemaTypeRecursive);
        }
        if (schema.getOneOf() != null) {
            schema.getOneOf().forEach(this::normalizeSchemaTypeRecursive);
        }
        normalizeSchemaTypeRecursive(schema.getNot());
    }

    private Schema<?> extractAdditionalPropertiesSchema(Object additionalProperties) {
        return additionalProperties instanceof Schema<?> additionalSchema ? additionalSchema : null;
    }

    private NamespaceResult namespaceComponentKeys(OpenAPI serviceApi, String serviceKey) {
        Components components = serviceApi.getComponents();
        if (components == null) {
            return new NamespaceResult(Map.of(), Map.of());
        }

        Map<String, String> refMappings = new LinkedHashMap<>();
        Map<String, String> securitySchemeNameMapping = new LinkedHashMap<>();
        renameSection(components.getSchemas(), "schemas", serviceKey, refMappings);
        renameSection(components.getResponses(), "responses", serviceKey, refMappings);
        renameSection(components.getParameters(), "parameters", serviceKey, refMappings);
        renameSection(components.getExamples(), "examples", serviceKey, refMappings);
        renameSection(components.getRequestBodies(), "requestBodies", serviceKey, refMappings);
        renameSection(components.getHeaders(), "headers", serviceKey, refMappings);
        renameSection(components.getLinks(), "links", serviceKey, refMappings);
        renameSection(components.getCallbacks(), "callbacks", serviceKey, refMappings);
        renameSection(components.getPathItems(), "pathItems", serviceKey, refMappings);
        renameSecuritySchemes(components.getSecuritySchemes(), serviceKey, refMappings, securitySchemeNameMapping);

        return new NamespaceResult(refMappings, securitySchemeNameMapping);
    }

    private <T> void renameSection(Map<String, T> section, String sectionName, String serviceKey, Map<String, String> refMappings) {
        if (section == null || section.isEmpty()) {
            return;
        }
        Map<String, T> renamed = new LinkedHashMap<>();
        section.forEach((key, value) -> {
            String newKey = serviceKey + "_" + key;
            renamed.put(newKey, value);
            refMappings.put("#/components/" + sectionName + "/" + key, "#/components/" + sectionName + "/" + newKey);
        });
        section.clear();
        section.putAll(renamed);
    }

    private <T> void renameSecuritySchemes(Map<String, T> section, String serviceKey, Map<String, String> refMappings,
                                       Map<String, String> securitySchemeNameMapping) {
        if (section == null || section.isEmpty()) {
            return;
        }
        Map<String, T> renamed = new LinkedHashMap<>();
        section.forEach((key, value) -> {
            String newKey = serviceKey + "_" + key;
            securitySchemeNameMapping.put(key, newKey);
            renamed.put(newKey, value);
            refMappings.put("#/components/securitySchemes/" + key, "#/components/securitySchemes/" + newKey);
        });
        section.clear();
        section.putAll(renamed);
    }

    private void rewriteComponentRefs(OpenAPI serviceApi, Map<String, String> refMappings) {
        if (refMappings.isEmpty()) {
            return;
        }
        JsonNode root = Json.mapper().valueToTree(serviceApi);
        rewriteComponentRefsRecursive(root, refMappings);
        OpenAPI rewritten = Json.mapper().convertValue(root, OpenAPI.class);
        serviceApi.setPaths(rewritten.getPaths());
        serviceApi.setComponents(rewritten.getComponents());
        serviceApi.setTags(rewritten.getTags());
        serviceApi.setServers(rewritten.getServers());
        serviceApi.setSecurity(rewritten.getSecurity());
        serviceApi.setWebhooks(rewritten.getWebhooks());
    }

    private void rewriteComponentRefsRecursive(JsonNode node, Map<String, String> refMappings) {
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
            objectNode.properties().forEach(field -> rewriteComponentRefsRecursive(field.getValue(), refMappings));
            return;
        }
        if (node.isArray()) {
            ArrayNode arrayNode = (ArrayNode) node;
            arrayNode.forEach(child -> rewriteComponentRefsRecursive(child, refMappings));
        }
    }

    private void renameSecurityRequirements(OpenAPI serviceApi, Map<String, String> securitySchemeNameMapping) {
        if (securitySchemeNameMapping.isEmpty()) {
            return;
        }
        renameSecurityRequirementList(serviceApi.getSecurity(), securitySchemeNameMapping);
        if (serviceApi.getPaths() == null) {
            return;
        }
        serviceApi.getPaths().values().forEach(pathItem -> {
            Map<PathItem.HttpMethod, Operation> operationMap = pathItem.readOperationsMap();
            if (operationMap == null) {
                return;
            }
            operationMap.values().forEach(operation -> renameSecurityRequirementList(operation.getSecurity(), securitySchemeNameMapping));
        });
    }

    private void renameSecurityRequirementList(List<SecurityRequirement> requirements, Map<String, String> securitySchemeNameMapping) {
        if (requirements == null || requirements.isEmpty()) {
            return;
        }
        requirements.replaceAll(requirement -> {
            SecurityRequirement renamedRequirement = new SecurityRequirement();
            requirement.forEach((name, scopes) -> {
                String mappedName = securitySchemeNameMapping.getOrDefault(name, name);
                renamedRequirement.put(mappedName, scopes);
            });
            return renamedRequirement;
        });
    }

    private String resolveMergedPath(String gatewayPrefix, String servicePath) {
        String normalizedPrefix = normalizePath(gatewayPrefix);
        String normalizedServicePath = normalizePath(servicePath);
        if (normalizedServicePath.equals(normalizedPrefix) || normalizedServicePath.startsWith(normalizedPrefix + "/")) {
            return normalizedServicePath;
        }
        if ("/".equals(normalizedPrefix)) {
            return normalizedServicePath;
        }
        if ("/".equals(normalizedServicePath)) {
            return normalizedPrefix;
        }
        return normalizedPrefix + normalizedServicePath;
    }

    private String normalizePath(String rawPath) {
        if (!StringUtils.hasText(rawPath)) {
            return "/";
        }
        String path = rawPath.trim();
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        if (path.length() > 1 && path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }
        return path;
    }

    private String makeUniqueOperationId(String baseOperationId, Set<String> usedOperationIds) {
        String candidate = baseOperationId;
        int suffix = 2;
        while (!usedOperationIds.add(candidate)) {
            candidate = baseOperationId + "_" + suffix;
            suffix++;
        }
        return candidate;
    }

    private String toIdentifierPart(String value) {
        if (!StringUtils.hasText(value)) {
            return "op";
        }
        return value.replaceAll("[^A-Za-z0-9]+", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "")
                .toLowerCase(Locale.ROOT);
    }

    private void mergeComponents(OpenAPI mergedApi, OpenAPI serviceApi) {
        if (serviceApi.getComponents() == null) {
            return;
        }
        Components mergedComponents = mergedApi.getComponents();
        Components serviceComponents = serviceApi.getComponents();

        mergedComponents.setSchemas(mergeMapSection(mergedComponents.getSchemas(), serviceComponents.getSchemas(), "components.schemas"));
        mergedComponents.setResponses(mergeMapSection(mergedComponents.getResponses(), serviceComponents.getResponses(), "components.responses"));
        mergedComponents.setParameters(mergeMapSection(mergedComponents.getParameters(), serviceComponents.getParameters(), "components.parameters"));
        mergedComponents.setExamples(mergeMapSection(mergedComponents.getExamples(), serviceComponents.getExamples(), "components.examples"));
        mergedComponents.setRequestBodies(mergeMapSection(mergedComponents.getRequestBodies(), serviceComponents.getRequestBodies(), "components.requestBodies"));
        mergedComponents.setHeaders(mergeMapSection(mergedComponents.getHeaders(), serviceComponents.getHeaders(), "components.headers"));
        mergedComponents.setSecuritySchemes(mergeMapSection(mergedComponents.getSecuritySchemes(), serviceComponents.getSecuritySchemes(), "components.securitySchemes"));
        mergedComponents.setLinks(mergeMapSection(mergedComponents.getLinks(), serviceComponents.getLinks(), "components.links"));
        mergedComponents.setCallbacks(mergeMapSection(mergedComponents.getCallbacks(), serviceComponents.getCallbacks(), "components.callbacks"));
        mergedComponents.setPathItems(mergeMapSection(mergedComponents.getPathItems(), serviceComponents.getPathItems(), "components.pathItems"));
    }

    private <T> Map<String, T> mergeMapSection(Map<String, T> target, Map<String, T> source, String sectionName) {
        Map<String, T> effectiveTarget = target != null ? target : new LinkedHashMap<>();
        if (source == null || source.isEmpty()) {
            return effectiveTarget;
        }
        for (Map.Entry<String, T> entry : source.entrySet()) {
            if (effectiveTarget.containsKey(entry.getKey())) {
                throw new IllegalStateException("Duplicate key in " + sectionName + ": " + entry.getKey());
            }
            effectiveTarget.put(entry.getKey(), entry.getValue());
        }
        return effectiveTarget;
    }

    private void mergeTags(OpenAPI mergedApi, OpenAPI serviceApi, Set<String> usedTagNames) {
        if (serviceApi.getTags() == null || serviceApi.getTags().isEmpty()) {
            return;
        }
        if (mergedApi.getTags() == null) {
            mergedApi.setTags(new ArrayList<>());
        }
        for (Tag tag : serviceApi.getTags()) {
            String tagName = StringUtils.hasText(tag.getName()) ? tag.getName() : "untagged";
            if (usedTagNames.add(tagName)) {
                mergedApi.getTags().add(tag);
            }
        }
    }

    private void mergeServers(OpenAPI mergedApi, OpenAPI serviceApi, Set<String> usedServerUrls) {
        if (serviceApi.getServers() == null || serviceApi.getServers().isEmpty()) {
            return;
        }
        if (mergedApi.getServers() == null) {
            mergedApi.setServers(new ArrayList<>());
        }
        for (Server server : serviceApi.getServers()) {
            String serverUrl = StringUtils.hasText(server.getUrl()) ? server.getUrl() : "";
            if (usedServerUrls.add(serverUrl)) {
                mergedApi.getServers().add(server);
            }
        }
    }

    private void mergeSecurity(OpenAPI mergedApi, OpenAPI serviceApi) {
        if (serviceApi.getSecurity() == null || serviceApi.getSecurity().isEmpty()) {
            return;
        }
        if (mergedApi.getSecurity() == null) {
            mergedApi.setSecurity(new ArrayList<>());
        }
        mergedApi.getSecurity().addAll(serviceApi.getSecurity());
    }

    private void mergeExternalDocs(OpenAPI mergedApi, OpenAPI serviceApi) {
        ExternalDocumentation externalDocs = serviceApi.getExternalDocs();
        if (mergedApi.getExternalDocs() == null && externalDocs != null) {
            mergedApi.setExternalDocs(externalDocs);
        }
    }

    private void mergeWebhooks(OpenAPI mergedApi, OpenAPI serviceApi) {
        if (serviceApi.getWebhooks() == null || serviceApi.getWebhooks().isEmpty()) {
            return;
        }
        if (mergedApi.getWebhooks() == null) {
            mergedApi.setWebhooks(new LinkedHashMap<>());
        }
        for (Map.Entry<String, PathItem> webhook : serviceApi.getWebhooks().entrySet()) {
            if (mergedApi.getWebhooks().containsKey(webhook.getKey())) {
                throw new IllegalStateException("Duplicate webhook key in merged OpenAPI: " + webhook.getKey());
            }
            mergedApi.getWebhooks().put(webhook.getKey(), webhook.getValue());
        }
    }

    private void mergeExtensions(OpenAPI mergedApi, OpenAPI serviceApi) {
        Map<String, Object> sourceExtensions = serviceApi.getExtensions();
        if (sourceExtensions == null || sourceExtensions.isEmpty()) {
            return;
        }
        if (mergedApi.getExtensions() == null) {
            mergedApi.setExtensions(new LinkedHashMap<>());
        }
        for (Map.Entry<String, Object> extension : sourceExtensions.entrySet()) {
            mergedApi.getExtensions().putIfAbsent(extension.getKey(), extension.getValue());
        }
    }

    private String buildGatewayBaseUrl(URI requestUri) {
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance()
                .scheme(requestUri.getScheme())
                .host(requestUri.getHost());

        if (requestUri.getPort() > -1) {
            builder.port(requestUri.getPort());
        }

        String baseUrl = builder.build().toUriString();
        if (!StringUtils.hasText(baseUrl)) {
            throw new IllegalStateException("Unable to determine gateway base URL for OpenAPI aggregation");
        }

        return baseUrl;
    }

    private record ServiceDoc(String name, String routePrefix, String docsPath) {
    }

    private record NamespaceResult(Map<String, String> refMappings, Map<String, String> securitySchemeNameMapping) {
    }
}