package org.zerp.socket_service.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.zerp.socket_service.interceptor.InboundRateLimitInterceptor;
import org.zerp.socket_service.interceptor.SocketHandshakeInterceptor;
import org.zerp.socket_service.interceptor.StompPrincipalInterceptor;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final SocketServiceProperties socketServiceProperties;
    private final SocketHandshakeInterceptor socketHandshakeInterceptor;
    private final StompPrincipalInterceptor stompPrincipalInterceptor;
    private final InboundRateLimitInterceptor inboundRateLimitInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint(socketServiceProperties.getEndpoint())
                .addInterceptors(socketHandshakeInterceptor)
                .setAllowedOriginPatterns(socketServiceProperties.getAllowedOriginPatterns().toArray(String[]::new));
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompPrincipalInterceptor, inboundRateLimitInterceptor);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
        registry.enableSimpleBroker("/topic", "/queue");
    }
}
