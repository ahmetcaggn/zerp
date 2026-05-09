package org.zerp.gateway.openapi;

/**
 * Describes a microservice whose OpenAPI docs should be aggregated.
 *
 * @param name        human-readable service name (used in error messages and conflict namespacing)
 * @param routePrefix the gateway route prefix (e.g. "/crm")
 * @param docsPath    the path to fetch the service's OpenAPI JSON (e.g. "/v3/api-docs/crm")
 */
public record ServiceDoc(String name, String routePrefix, String docsPath) {
}
