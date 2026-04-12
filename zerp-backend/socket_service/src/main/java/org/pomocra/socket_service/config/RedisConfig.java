package org.pomocra.socket_service.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.pomocra.socket_service.listener.PrivacyEventSubscriber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

import java.util.Properties;

@Configuration
@Log4j2
@RequiredArgsConstructor
public class RedisConfig {

    private final RedisConnectionFactory redisConnectionFactory;
    private final PrivacyEventSubscriber subscriber;

    @Value("${redis.privacy.setting.channel:privacy.setting.changed}")
    private String privacyChannel;

    // Enable keyspace notifications for expired keys
    @PostConstruct
    public void enableKeyspaceNotifications() {
        try (RedisConnection connection = redisConnectionFactory.getConnection()) {
            // Enable keyspace notifications for expired keys
            // "Ex" means: E = keyevent channel, x = expire events
            Properties config = connection.serverCommands().getConfig("notify-keyspace-events");
            log.info("Current Redis notify-keyspace-events config: {}", config);

            connection.serverCommands().setConfig("notify-keyspace-events", "Ex");
            log.info("Enabled Redis keyspace notifications for expired keys (Ex)");
        } catch (Exception e) {
            log.warn("Could not enable Redis keyspace notifications: {}", e.getMessage());
        }
    }

    // Bean for RedisMessageListenerContainer
    @Bean
    RedisMessageListenerContainer redisMessageListenerContainer() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(redisConnectionFactory);

        // Subscribe to the "privacy.setting.changed" channel for privacy setting change events
        container.addMessageListener(
                subscriber,
                new ChannelTopic(privacyChannel)
        );
        return container;
    }
}
