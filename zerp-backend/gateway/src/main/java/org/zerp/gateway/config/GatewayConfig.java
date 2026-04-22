package org.zerp.gateway.config;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class GatewayConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }

    @Bean
    public RouteLocator gatewayRouter(RouteLocatorBuilder routeLocatorBuilder) {
        return routeLocatorBuilder.routes()
                .route(r -> r
                        .path("/gateway/**")
                        .filters(f -> f.retry(retryConfig -> retryConfig
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                        .setMethods(HttpMethod.GET)
                                )
                        )
                        .uri("http://localhost:8080")
                )
                .route(r -> r
                        .path("/v3/api-docs/notification/**")
                        .filters(f -> f
                                .rewritePath("/v3/api-docs/notification(?<segment>/?.*)", "/v3/api-docs${segment}")
                        )
                        .uri("lb://NOTIFICATION")
                )
                .route(r -> r
                        .path("/notification/swagger-ui/**")
                        .filters(f -> f
                                .rewritePath("/notification/swagger-ui(?<segment>/?.*)", "/swagger-ui${segment}")
                        )
                        .uri("lb://NOTIFICATION")
                )
                .route(r -> r
                        .path("/v3/api-docs/employee/**")
                        .filters(f -> f
                                .rewritePath("/v3/api-docs/employee(?<segment>/?.*)", "/v3/api-docs${segment}")
                        )
                        .uri("lb://EMPLOYEE")
                )
                .route(r -> r
                        .path("/employee/swagger-ui/**")
                        .filters(f -> f
                                .rewritePath("/employee/swagger-ui(?<segment>/?.*)", "/swagger-ui${segment}")
                        )
                        .uri("lb://EMPLOYEE")
                )
                .route(r -> r
                        .path("/v3/api-docs/crm/**")
                        .filters(f -> f
                                .rewritePath("/v3/api-docs/crm(?<segment>/?.*)", "/v3/api-docs${segment}")
                        )
                        .uri("lb://CRM")
                )
                .route(r -> r
                        .path("/crm/swagger-ui/**")
                        .filters(f -> f
                                .rewritePath("/crm/swagger-ui(?<segment>/?.*)", "/swagger-ui${segment}")
                        )
                        .uri("lb://CRM")
                )
                .route(r -> r
                        .path("/notification/**")
                        .filters(f -> f
                                .retry(retryConfig -> retryConfig
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                )
                        )
                        .uri("lb://NOTIFICATION")
                )
                .route(r -> r
                        .path("/employee/**")
                        .filters(f -> f
                                .retry(retryConfig -> retryConfig
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                )
                        )
                        .uri("lb://EMPLOYEE")
                )
                .route(r -> r
                        .path("/crm/**")

                        .filters(f -> f
                                .retry(retryConfig -> retryConfig
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                )
                        )
                        .uri("lb://CRM")
                )
                .route(r -> r
                        .path("/v3/api-docs/resource/**")
                        .filters(f -> f
                                .rewritePath("/v3/api-docs/resource(?<segment>/?.*)", "/v3/api-docs${segment}")
                        )
                        .uri("lb://RESOURCE")
                )
                .route(r -> r
                        .path("/resource/swagger-ui/**")
                        .filters(f -> f
                                .rewritePath("/resource/swagger-ui(?<segment>/?.*)", "/swagger-ui${segment}")
                        )
                        .uri("lb://RESOURCE")
                )
                .route(r -> r
                        .path("/resource/**")
                        .filters(f -> f
                                .retry(retryConfig -> retryConfig
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                )
                        )
                        .uri("lb://RESOURCE")
                )
                .route(r -> r
                        .path("/v3/api-docs/sale/**")
                        .filters(f -> f
                                .rewritePath("/v3/api-docs/sale(?<segment>/?.*)", "/v3/api-docs${segment}")
                        )
                        .uri("lb://SALE")
                )
                .route(r -> r
                        .path("/sale/swagger-ui/**")
                        .filters(f -> f
                                .rewritePath("/sale/swagger-ui(?<segment>/?.*)", "/swagger-ui${segment}")
                        )
                        .uri("lb://SALE")
                )
                .route(r -> r
                        .path("/sale/**")
                        .filters(f -> f
                                .retry(retryConfig -> retryConfig
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                )
                        )
                        .uri("lb://SALE")
                )
                .route(r -> r
                        .path("/v3/api-docs/suggestion/**")
                        .filters(f -> f
                                .rewritePath("/v3/api-docs/suggestion(?<segment>/?.*)", "/v3/api-docs${segment}")
                        )
                        .uri("lb://SUGGESTION")
                )
                .route(r -> r
                        .path("/suggestion/swagger-ui/**")
                        .filters(f -> f
                                .rewritePath("/suggestion/swagger-ui(?<segment>/?.*)", "/swagger-ui${segment}")
                        )
                        .uri("lb://SUGGESTION")
                )
                .route(r -> r
                        .path("/suggestion/**")
                        .filters(f -> f
                                .retry(retryConfig -> retryConfig
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                )
                        )
                        .uri("lb://SUGGESTION")
                )
                .route(r -> r
                        .path("/user/**")
                        .filters(f -> f
                                .retry(retryConfig -> retryConfig
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                )
                        ).uri("lb://USER")
                )
                .build();
    }
}
