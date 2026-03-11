package org.zerp.notification.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.zerp.notification.model.KafkaEmailMessage;
import org.zerp.notification.service.EmailService;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailKafkaConsumer {

    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "${kafka.topic.email:email-notifications}", groupId = "notification-consumer", containerFactory = "kafkaListenerContainerFactory")
    public void consumeEmailMessage(String message) {
        log.info("Received Kafka message: {}", message);
        
        try {
            KafkaEmailMessage emailMessage = objectMapper.readValue(message, KafkaEmailMessage.class);
            
            switch (emailMessage.getType()) {
                case SINGLE:
                    handleSingleEmail(emailMessage);
                    break;
                case LIST:
                    handleListEmail(emailMessage);
                    break;
                case HTML:
                    handleHtmlEmail(emailMessage);
                    break;
                default:
                    log.warn("Unknown email type: {}", emailMessage.getType());
            }
            
        } catch (JsonProcessingException e) {
            log.error("Failed to parse Kafka message: {}", message, e);
        } catch (Exception e) {
            log.error("Failed to process email message: {}", message, e);
        }
    }

    private void handleSingleEmail(KafkaEmailMessage emailMessage) {
        if (emailMessage.getTo() == null || emailMessage.getTo().isEmpty()) {
            log.error("Single email type requires 'to' field");
            return;
        }
        
        log.info("Sending single email to: {}", emailMessage.getTo());
        emailService.sendEmail(
                emailMessage.getTo(),
                emailMessage.getSubject(),
                emailMessage.getBody()
        );
        log.info("Successfully sent single email to: {}", emailMessage.getTo());
    }

    private void handleListEmail(KafkaEmailMessage emailMessage) {
        if (emailMessage.getToList() == null || emailMessage.getToList().isEmpty()) {
            log.error("List email type requires 'toList' field");
            return;
        }
        
        log.info("Sending email to list: {}", emailMessage.getToList());
        emailService.sendEmailToList(
                emailMessage.getToList(),
                emailMessage.getSubject(),
                emailMessage.getBody()
        );
        log.info("Successfully sent email to {} recipients", emailMessage.getToList().size());
    }

    private void handleHtmlEmail(KafkaEmailMessage emailMessage) {
        if (emailMessage.getToList() == null || emailMessage.getToList().isEmpty()) {
            log.error("HTML email type requires 'toList' field");
            return;
        }
        
        log.info("Sending HTML email to list: {}", emailMessage.getToList());
        emailService.sendEmailToListWithHtml(
                emailMessage.getToList(),
                emailMessage.getSubject(),
                emailMessage.getBody(),
                emailMessage.getHtmlBody()
        );
        log.info("Successfully sent HTML email to {} recipients", emailMessage.getToList().size());
    }
}
