package org.zerp.gateway.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.zerp.gateway.service.CheckUserResult;
import org.zerp.gateway.service.LazyUserCreateService;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class GatewaySecurityConfig {

    @Value("${app.cors.allowedOrigin}")
    private String allowedOrigins;

    private final LazyUserCreateService lazyUserCreateService;

    @Bean
    public ServerAuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (exchange, _) -> {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
            byte[] bytes = "{\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}".getBytes();
            return exchange.getResponse().writeWith(
                    Mono.just(exchange.getResponse().bufferFactory().wrap(bytes))
            );
        };
    }

    @Bean
    public ServerAccessDeniedHandler customAccessDeniedHandler() {
        return (exchange, _) -> {
            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
            byte[] bytes = "{\"error\":\"Forbidden\",\"message\":\"Access denied\"}".getBytes();
            return exchange.getResponse().writeWith(
                    Mono.just(exchange.getResponse().bufferFactory().wrap(bytes))
            );
        };
    }

    /**
     * Converts Keycloak JWT claims to Spring Security GrantedAuthorities.
     * Maps realm_access.roles → ROLE_<ROLE> and resource_access.<client>.roles → ROLE_<ROLE>.
     */
    @Bean
    public ReactiveJwtAuthenticationConverter keycloakJwtConverter() {
        ReactiveJwtAuthenticationConverter converter = new ReactiveJwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<GrantedAuthority> authorities = new ArrayList<>();

            // realm-level roles
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null) {
                Object roles = realmAccess.get("roles");
                if (roles instanceof List<?> roleList) {
                    roleList.stream()
                            .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toString().toUpperCase()))
                            .forEach(authorities::add);
                }
            }

            // resource/client-level roles
            Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
            if (resourceAccess != null) {
                resourceAccess.forEach((_, value) -> {
                    if (value instanceof Map<?, ?> clientMap) {
                        Object roles = clientMap.get("roles");
                        if (roles instanceof List<?> roleList) {
                            roleList.stream()
                                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toString().toUpperCase()))
                                    .forEach(authorities::add);
                        }
                    }
                });
            }

            return reactor.core.publisher.Flux.fromIterable(authorities);
        });
        return converter;
    }

    /**
     * Propagates user info extracted from the Keycloak JWT as downstream request headers.
     * X-User-Id → subclaim, X-User-Email → email claim, X-User-Roles → comma-separated roles.
     */
    @Bean
    public WebFilter userHeaderPropagationFilter() {
        return (exchange, chain) -> exchange.getPrincipal()
                .filter(p -> p instanceof JwtAuthenticationToken)
                .cast(JwtAuthenticationToken.class)
                .flatMap(token -> {
                    Jwt jwt = token.getToken();
                    String email = jwt.getClaimAsString("email");
                    String roles = token.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority).filter(Objects::nonNull)
                            .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
                            .collect(Collectors.joining(","));

                    return lazyUserCreateService.checkUser(jwt)
                            .flatMap(result -> {
                                if (!result.isSuccess()) {
                                    return writeCheckUserFailure(exchange, result).thenReturn(Boolean.TRUE);
                                }

                                ServerHttpRequest mutated = exchange.getRequest().mutate()
                                        .header("X-User-Id", String.valueOf(result.getUserId()))
                                        .header("X-User-Email", result.getEmail() != null ? result.getEmail() : (email != null ? email : ""))
                                        .header("X-User-Roles", roles)
                                        .build();
                                return chain.filter(exchange.mutate().request(mutated).build()).thenReturn(Boolean.TRUE);
                            });
                })
                .switchIfEmpty(Mono.defer(() -> chain.filter(exchange).thenReturn(Boolean.TRUE)))
                .then();
    }

    private Mono<Void> writeCheckUserFailure(ServerWebExchange exchange, CheckUserResult result) {
        HttpStatus status = result.getHttpStatus() != null ? result.getHttpStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        String errorCode = sanitizeJson(result.getErrorCode() != null ? result.getErrorCode() : "USER_CHECK_FAILED");
        String message = sanitizeJson(result.getMessage() != null ? result.getMessage() : "User check failed");
        String payload = String.format(
                "{\"error\":\"%s\",\"message\":\"%s\",\"status\":%d,\"timestamp\":\"%s\"}",
                errorCode,
                message,
                status.value(),
                Instant.now()
        );

        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes = payload.getBytes(StandardCharsets.UTF_8);
        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse().bufferFactory().wrap(bytes))
        );
    }

    private String sanitizeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http,
                                                      ServerAuthenticationEntryPoint authenticationEntryPoint,
                                                      ServerAccessDeniedHandler accessDeniedHandler,
                                                      ReactiveJwtAuthenticationConverter keycloakJwtConverter) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(_ -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    for (String origin : allowedOrigins.split(",")) {
                        config.addAllowedOrigin(origin.trim());
                    }
                    config.addAllowedMethod("*");
                    config.addAllowedHeader("*");
                    config.setAllowCredentials(true);
                    return config;
                }))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtConverter))
                )
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/swagger-ui/**").permitAll()
                        .pathMatchers("/v3/api-docs/**").permitAll()
                        .pathMatchers("/employee/**").authenticated()
                        .pathMatchers("/notification/**").authenticated()
                        .pathMatchers("/resource/**").authenticated()
                        .pathMatchers("/sale/**").authenticated()
                        .pathMatchers("/user/**").authenticated()
                        .pathMatchers("/suggestion/**").authenticated()
                        .pathMatchers("/crm/**").authenticated()
                        .anyExchange().denyAll()
                );

        return http.build();
    }
}
