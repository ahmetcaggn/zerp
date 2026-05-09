package org.zerp.gateway.openapi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Merges non-schema component sections from a service API into the aggregated result.
 * Handles: tags, servers, security requirements, external docs, webhooks, and extensions.
 */
@Log4j2
@Component
public class ComponentMerger {

    public void mergeTags(OpenAPI mergedApi, OpenAPI serviceApi, Set<String> usedTagNames, String serviceName) {
        if (serviceApi.getTags() == null || serviceApi.getTags().isEmpty()) return;
        if (mergedApi.getTags() == null) mergedApi.setTags(new ArrayList<>());

        for (Tag incomingTag : serviceApi.getTags()) {
            String tagName = StringUtils.hasText(incomingTag.getName()) ? incomingTag.getName() : "untagged";
            if (usedTagNames.add(tagName)) {
                mergedApi.getTags().add(incomingTag);
            } else {
                mergedApi.getTags().stream()
                        .filter(existing -> tagName.equals(existing.getName()))
                        .findFirst()
                        .ifPresent(existingTag -> {
                            if (!isEqualOrBothBlank(existingTag.getDescription(), incomingTag.getDescription())) {
                                log.error("Tag conflict: tag '{}' from service '{}' has a different description. Keeping first.", tagName, serviceName);
                            }
                        });
            }
        }
    }

    public void mergeServers(OpenAPI mergedApi, OpenAPI serviceApi, Set<String> usedServerUrls) {
        if (serviceApi.getServers() == null || serviceApi.getServers().isEmpty()) return;
        if (mergedApi.getServers() == null) mergedApi.setServers(new ArrayList<>());

        for (Server server : serviceApi.getServers()) {
            String serverUrl = StringUtils.hasText(server.getUrl()) ? server.getUrl() : "";
            if (usedServerUrls.add(serverUrl)) mergedApi.getServers().add(server);
        }
    }

    public void mergeSecurity(OpenAPI mergedApi, OpenAPI serviceApi) {
        if (serviceApi.getSecurity() == null || serviceApi.getSecurity().isEmpty()) return;
        if (mergedApi.getSecurity() == null) mergedApi.setSecurity(new ArrayList<>());
        mergedApi.getSecurity().addAll(serviceApi.getSecurity());
    }

    public void renameSecurityRequirements(OpenAPI serviceApi, Map<String, String> schemeNameMapping) {
        if (schemeNameMapping.isEmpty()) return;
        renameSecurityList(serviceApi.getSecurity(), schemeNameMapping);
        if (serviceApi.getPaths() == null) return;
        serviceApi.getPaths().values().forEach(pathItem -> {
            var ops = pathItem.readOperationsMap();
            if (ops != null) ops.values().forEach(op -> renameSecurityList(op.getSecurity(), schemeNameMapping));
        });
    }

    public void mergeExternalDocs(OpenAPI mergedApi, OpenAPI serviceApi) {
        if (mergedApi.getExternalDocs() == null && serviceApi.getExternalDocs() != null) {
            mergedApi.setExternalDocs(serviceApi.getExternalDocs());
        }
    }

    public void mergeWebhooks(OpenAPI mergedApi, OpenAPI serviceApi) {
        if (serviceApi.getWebhooks() == null || serviceApi.getWebhooks().isEmpty()) return;
        if (mergedApi.getWebhooks() == null) mergedApi.setWebhooks(new LinkedHashMap<>());
        for (var wh : serviceApi.getWebhooks().entrySet()) {
            if (mergedApi.getWebhooks().containsKey(wh.getKey())) {
                throw new IllegalStateException("Duplicate webhook key: " + wh.getKey());
            }
            mergedApi.getWebhooks().put(wh.getKey(), wh.getValue());
        }
    }

    public void mergeExtensions(OpenAPI mergedApi, OpenAPI serviceApi) {
        var src = serviceApi.getExtensions();
        if (src == null || src.isEmpty()) return;
        if (mergedApi.getExtensions() == null) mergedApi.setExtensions(new LinkedHashMap<>());
        src.forEach((k, v) -> mergedApi.getExtensions().putIfAbsent(k, v));
    }

    private void renameSecurityList(List<SecurityRequirement> reqs, Map<String, String> mapping) {
        if (reqs == null || reqs.isEmpty()) return;
        reqs.replaceAll(req -> {
            SecurityRequirement renamed = new SecurityRequirement();
            req.forEach((name, scopes) -> renamed.put(mapping.getOrDefault(name, name), scopes));
            return renamed;
        });
    }

    private boolean isEqualOrBothBlank(String a, String b) {
        boolean aBlank = !StringUtils.hasText(a), bBlank = !StringUtils.hasText(b);
        if (aBlank && bBlank) return true;
        if (aBlank || bBlank) return false;
        return a.equals(b);
    }
}
