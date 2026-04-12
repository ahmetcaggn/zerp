package org.pomocra.socket_service.config;

import lombok.RequiredArgsConstructor;
import org.pomocra.socket_service.interceptor.RateLimitInterceptor;
import org.pomocra.socket_service.interceptor.UserHandshakeInterceptor;
import org.pomocra.socket_service.interceptor.WebSocketAuthInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final UserHandshakeInterceptor handshakeInterceptor;
    private final WebSocketAuthInterceptor authInterceptor;
    private final RateLimitInterceptor rateLimitInterceptor;

    @Value("${app.cors.allowedOrigin:http://localhost:3000}")
    private String allowedOrigin;

    // Register STOMP endpoint (native WebSocket, no SockJS)
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .addInterceptors(handshakeInterceptor)
                .setAllowedOrigins(allowedOrigin);
    }

    // Configure inbound channel with authentication and rate limiting interceptors
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(authInterceptor, rateLimitInterceptor);
    }

    // Configure message broker
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setUserDestinationPrefix("/user");
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }
}
