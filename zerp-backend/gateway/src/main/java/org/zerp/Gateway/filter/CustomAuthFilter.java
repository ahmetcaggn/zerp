package org.zerp.Gateway.filter;

import org.zerp.Gateway.dto.TokenValidateDto;
import org.zerp.Gateway.exception.CustomForbiddenException;
import org.zerp.Gateway.exception.InvalidJwtTokenException;
import org.zerp.Gateway.exception.NoSuchServiceException;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;


@Component
public class CustomAuthFilter extends AbstractGatewayFilterFactory<CustomAuthFilter.Config> {

    private final RestTemplate restTemplate;

    private final DiscoveryClient discoveryClient;

    public CustomAuthFilter(RestTemplate restTemplate, DiscoveryClient discoveryClient) {
        super(Config.class);
        this.restTemplate = restTemplate;
        this.discoveryClient = discoveryClient;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                throw new InvalidJwtTokenException("No authorization header");
            }

            String authHeader = Objects.requireNonNull(exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION)).get(0);

            if (!authHeader.startsWith("Bearer ")) {
                throw new InvalidJwtTokenException("Authorization header must start with Bearer");
            }
            // Security Service instance
            ServiceInstance serviceInstance;
            String serviceName = "SECURITY";
            try {
                serviceInstance = discoveryClient.getInstances(serviceName).get(0);
            } catch (Exception e) {
                throw new NoSuchServiceException(serviceName + " service is not available");
            }
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.set("Authorization", authHeader);
            String correlationId = exchange.getRequest().getHeaders().getFirst(RequestContextWebFilter.CORRELATION_ID_HEADER);
            if (StringUtils.hasText(correlationId)) {
                httpHeaders.set(RequestContextWebFilter.CORRELATION_ID_HEADER, correlationId);
            }
            String clientIp = exchange.getRequest().getHeaders().getFirst(RequestContextWebFilter.CLIENT_IP_HEADER);
            if (StringUtils.hasText(clientIp)) {
                httpHeaders.set(RequestContextWebFilter.CLIENT_IP_HEADER, clientIp);
            }
            String gatewayRequestStartMs = exchange.getRequest().getHeaders()
                    .getFirst(RequestContextWebFilter.GATEWAY_REQUEST_START_MS_HEADER);
            if (StringUtils.hasText(gatewayRequestStartMs)) {
                httpHeaders.set(RequestContextWebFilter.GATEWAY_REQUEST_START_MS_HEADER, gatewayRequestStartMs);
            }
            String token = authHeader.substring(7);
            HttpEntity<TokenValidateDto> httpRequest = new HttpEntity<>(new TokenValidateDto(token), httpHeaders);
            String urlValidate = serviceInstance.getUri() + "/security/validateToken";


            try {
                restTemplate.exchange(urlValidate, HttpMethod.POST, httpRequest, Boolean.class);
            } catch (Exception e) {
                throw new InvalidJwtTokenException("Invalid JWT token");
            }

            String path = exchange.getRequest().getPath().value();
            String serviceDeterminer = path.split("/")[1];
            HttpEntity<Boolean> httpRequestGet = new HttpEntity<>(httpHeaders);
            String url = serviceInstance.getUri() + "/security/" + serviceDeterminer;


            try {
                restTemplate.exchange(url, HttpMethod.GET, httpRequestGet, Boolean.class);
                return chain.filter(exchange);
            } catch (Exception e) {
                throw new CustomForbiddenException("Access denied!");
            }
        };
    }

    public static class Config {
    }
}
