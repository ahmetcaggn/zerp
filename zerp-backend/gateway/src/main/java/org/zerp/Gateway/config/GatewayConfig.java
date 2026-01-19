package org.zerp.Gateway.config;

import org.zerp.Gateway.filter.CustomAuthFilter;
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
        config.setAllowCredentials(true); // Eğer Cookie ile çalışıyorsan bu önemli

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }

    @Bean
    public RouteLocator gatewayRouter(RouteLocatorBuilder routeLocatorBuilder, CustomAuthFilter authFilter) {

        return routeLocatorBuilder.routes()
                .route(r -> r
                                .path("/email/**")
                                .filters(f -> f
//                                .filter(authFilter.apply(new CustomAuthFilter.Config()))
                                                .retry(retryConfig -> retryConfig
                                                        .setRetries(10)
                                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)
                                                        .setMethods(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                                                )
                                )
                                .uri("lb://NOTIFICATION")
                )
                .build();
    }
}
