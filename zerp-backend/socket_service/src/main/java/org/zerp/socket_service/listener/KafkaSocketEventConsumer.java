package org.zerp.socket_service.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.zerp.socket_service.event.SocketTopicEvent;
import org.zerp.socket_service.service.SocketNotificationDispatcher;

@Service
@Log4j2
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.socket.kafka", name = "enabled", havingValue = "true", matchIfMissing = true)
public class KafkaSocketEventConsumer {

    private final ObjectMapper objectMapper;
    private final SocketNotificationDispatcher socketNotificationDispatcher;

    @KafkaListener(
            id = "socketKafkaConsumer",
            topics = "#{@socketServiceProperties.kafkaTopic}",
            groupId = "#{@socketServiceProperties.kafkaConsumerGroupId}",
            containerFactory = "socketKafkaListenerContainerFactory"
    )
    public void consume(String rawMessage) {
        try {
            SocketTopicEvent socketTopicEvent = objectMapper.readValue(rawMessage, SocketTopicEvent.class);
            socketNotificationDispatcher.dispatch(socketTopicEvent);
        } catch (Exception exception) {
            log.error("Failed to consume websocket kafka message: {}", rawMessage, exception);
        }
    }
}
