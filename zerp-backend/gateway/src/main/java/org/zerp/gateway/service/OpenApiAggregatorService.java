package org.zerp.gateway.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.parser.OpenAPIParser;
import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.parser.core.models.SwaggerParseResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;
import org.zerp.gateway.openapi.ComponentMerger;
import org.zerp.gateway.openapi.OpenApiUtils;
import org.zerp.gateway.openapi.PathMerger;
import org.zerp.gateway.openapi.RefRewriter;
import org.zerp.gateway.openapi.SchemaDeduplicator;
import org.zerp.gateway.openapi.SchemaDeduplicator.DeduplicationResult;
import org.zerp.gateway.openapi.SchemaNormalizer;
import org.zerp.gateway.openapi.ServiceDoc;

import java.net.URI;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Orchestrates fetching, deduplicating, and merging OpenAPI specifications
 * from all registered microservices into a single aggregated document.
 */
@Log4j2
@Service
@RequiredArgsConstructor
public class OpenApiAggregatorService {

    private final SchemaNormalizer schemaNormalizer;
    private final SchemaDeduplicator schemaDeduplicator;
    private final RefRewriter refRewriter;
    private final PathMerger pathMerger;
    private final ComponentMerger componentMerger;

    private static final List<ServiceDoc> MICROSERVICE_DOCS = List.of(
            new ServiceDoc("CRM", "/crm", "/v3/api-docs/crm"),
            new ServiceDoc("Employee", "/employee", "/v3/api-docs/employee"),
            new ServiceDoc("Notification", "/notification", "/v3/api-docs/notification"),
            new ServiceDoc("Resource", "/resource", "/v3/api-docs/resource"),
            new ServiceDoc("Sale", "/sale", "/v3/api-docs/sale"),
            new ServiceDoc("Suggestion", "/suggestion", "/v3/api-docs/suggestion"),
            new ServiceDoc("User", "/user", "/v3/api-docs/user")
    );

    public String buildMergedSpec(URI requestUri) {
        OpenAPI mergedApi = createBaseMergedApi();
        Set<String> usedOperationIds = new HashSet<>();
        Set<String> usedTagNames = new HashSet<>();
        Set<String> usedServerUrls = new HashSet<>();
        String gatewayBaseUrl = buildGatewayBaseUrl(requestUri);

        for (ServiceDoc serviceDoc : MICROSERVICE_DOCS) {
            String docsUrl = gatewayBaseUrl + serviceDoc.docsPath();
            OpenAPI serviceApi = fetchAndParse(serviceDoc, docsUrl);
            if (serviceApi == null) continue;

            String serviceKey = OpenApiUtils.toIdentifierPart(serviceDoc.name());

            // 1. Normalize schema types
            schemaNormalizer.normalizeComponentSchemas(serviceApi.getComponents());

            // 2. Deduplicate components (content-based)
            DeduplicationResult dedupResult = schemaDeduplicator.deduplicate(
                    mergedApi.getComponents(), serviceApi.getComponents(),
                    serviceKey, serviceDoc.name());

            // 3. Rewrite $refs for any namespaced components
            refRewriter.rewriteRefs(serviceApi, dedupResult.refMappings());

            // 4. Rename security requirements if schemes were namespaced
            componentMerger.renameSecurityRequirements(serviceApi, dedupResult.securitySchemeNameMapping());

            // 5. Merge paths (preserves original operation IDs)
            pathMerger.mergePaths(mergedApi, serviceApi, serviceDoc, usedOperationIds);

            // 6. Merge deduplicated components into the result
            schemaDeduplicator.mergeDeduplicatedComponents(mergedApi.getComponents(), serviceApi.getComponents());

            // 7. Merge tags, servers, security, external docs, webhooks, extensions
            componentMerger.mergeTags(mergedApi, serviceApi, usedTagNames, serviceDoc.name());
            componentMerger.mergeServers(mergedApi, serviceApi, usedServerUrls);
            componentMerger.mergeSecurity(mergedApi, serviceApi);
            componentMerger.mergeExternalDocs(mergedApi, serviceApi);
            componentMerger.mergeWebhooks(mergedApi, serviceApi);
            componentMerger.mergeExtensions(mergedApi, serviceApi);
        }

        return serialize(mergedApi);
    }

    private OpenAPI createBaseMergedApi() {
        OpenAPI mergedApi = new OpenAPI();
        mergedApi.setOpenapi("3.0.1");
        mergedApi.setInfo(new Info().title("Central API Gateway Documentation").version("1.0.0"));
        mergedApi.setPaths(new Paths());
        mergedApi.setComponents(new Components());
        return mergedApi;
    }

    private OpenAPI fetchAndParse(ServiceDoc serviceDoc, String docsUrl) {
        SwaggerParseResult parseResult = new OpenAPIParser().readLocation(docsUrl, null, null);
        if (parseResult == null || parseResult.getOpenAPI() == null) {
            throw new IllegalStateException("Failed to parse OpenAPI docs for " + serviceDoc.name() + " from " + docsUrl);
        }
        if (parseResult.getMessages() != null && !parseResult.getMessages().isEmpty()) {
            throw new IllegalStateException("OpenAPI parse issues for " + serviceDoc.name() + ": " + String.join(" | ", parseResult.getMessages()));
        }
        return parseResult.getOpenAPI();
    }

    private String buildGatewayBaseUrl(URI requestUri) {
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance()
                .scheme(requestUri.getScheme())
                .host(requestUri.getHost());
        if (requestUri.getPort() > -1) builder.port(requestUri.getPort());
        String baseUrl = builder.build().toUriString();
        if (!StringUtils.hasText(baseUrl)) {
            throw new IllegalStateException("Unable to determine gateway base URL for OpenAPI aggregation");
        }
        return baseUrl;
    }

    private String serialize(OpenAPI mergedApi) {
        try {
            return Json.mapper().writerWithDefaultPrettyPrinter().writeValueAsString(mergedApi);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize merged OpenAPI specification", e);
        }
    }
}
