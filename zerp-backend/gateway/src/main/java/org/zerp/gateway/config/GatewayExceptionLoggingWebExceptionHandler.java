package org.zerp.gateway.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

@Log4j2
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GatewayExceptionLoggingWebExceptionHandler implements WebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        log.error("Unhandled exception for {} {}", exchange.getRequest().getMethod(), exchange.getRequest().getURI(), ex);
        return Mono.error(ex);
    }
}
