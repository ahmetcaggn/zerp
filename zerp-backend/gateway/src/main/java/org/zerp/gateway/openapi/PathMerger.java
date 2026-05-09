package org.zerp.gateway.openapi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Locale;
import java.util.Set;

/**
 * Merges paths from a service's OpenAPI spec into the aggregated result.
 * <p>
 * Preserves original operation IDs. Only appends a numeric suffix when an
 * actual collision is detected, and logs an error when this happens.
 */
@Log4j2
@Component
public class PathMerger {

    /**
     * Merges all paths from the service API into the merged API.
     *
     * @param mergedApi        the aggregated OpenAPI (mutated)
     * @param serviceApi       the service's OpenAPI spec
     * @param serviceDoc       service metadata (name, route prefix)
     * @param usedOperationIds accumulated set of operation IDs (mutated)
     */
    public void mergePaths(OpenAPI mergedApi, OpenAPI serviceApi, ServiceDoc serviceDoc,
                           Set<String> usedOperationIds) {
        if (serviceApi.getPaths() == null) {
            return;
        }
        if (mergedApi.getPaths() == null) {
            mergedApi.setPaths(new Paths());
        }

        serviceApi.getPaths().forEach((pathName, pathItem) -> {
            String mergedPath = resolveMergedPath(serviceDoc.routePrefix(), pathName);

            if (mergedApi.getPaths().containsKey(mergedPath)) {
                throw new IllegalStateException("Duplicate merged path detected: " + mergedPath);
            }

            if (pathItem.readOperationsMap() != null) {
                pathItem.readOperationsMap().forEach((httpMethod, operation) -> {
                    ensureOperationId(operation, httpMethod, mergedPath);
                    resolveOperationIdCollision(operation, serviceDoc.name(), usedOperationIds);
                });
            }

            mergedApi.getPaths().addPathItem(mergedPath, pathItem);
        });
    }

    private void ensureOperationId(Operation operation, PathItem.HttpMethod httpMethod, String mergedPath) {
        if (!StringUtils.hasText(operation.getOperationId())) {
            String generated = httpMethod.name().toLowerCase(Locale.ROOT)
                    + "_" + OpenApiUtils.toIdentifierPart(mergedPath);
            operation.setOperationId(generated);
        }
    }

    private void resolveOperationIdCollision(Operation operation, String serviceName,
                                             Set<String> usedOperationIds) {
        String originalId = operation.getOperationId();
        String candidate = originalId;
        int suffix = 2;

        while (!usedOperationIds.add(candidate)) {
            candidate = originalId + "_" + suffix;
            suffix++;
        }

        if (!candidate.equals(originalId)) {
            log.error("Operation ID collision: '{}' from service '{}' already exists. Renamed to '{}'.",
                    originalId, serviceName, candidate);
            operation.setOperationId(candidate);
        }
    }

    String resolveMergedPath(String gatewayPrefix, String servicePath) {
        String normalizedPrefix = normalizePath(gatewayPrefix);
        String normalizedServicePath = normalizePath(servicePath);

        if (normalizedServicePath.equals(normalizedPrefix)
                || normalizedServicePath.startsWith(normalizedPrefix + "/")) {
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
}
