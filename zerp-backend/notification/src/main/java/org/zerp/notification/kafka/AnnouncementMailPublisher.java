package org.zerp.notification.kafka;
 
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.zerp.notification.model.KafkaEmailMessage;
 
import java.util.Collections;
import java.util.List;
 
@Service
@RequiredArgsConstructor
public class AnnouncementMailPublisher {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
 
    @Value("${kafka.topic.email:email-notifications}")
    private String emailTopic;
 
    public void publishAnnouncementMail(List<String> recipients, String subject, String body, String senderName) {
        KafkaEmailMessage message = KafkaEmailMessage.builder()
                .type(KafkaEmailMessage.EmailType.ANNOUNCEMENT)
                .toList(recipients)
                .ccList(Collections.emptyList())
                .subject(subject)
                .body(body)
                .senderName(senderName)
                .template("announcement")
                .build();
 
        try {
            kafkaTemplate.send(emailTopic, objectMapper.writeValueAsString(message));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize announcement mail message", e);
        }
    }
}
