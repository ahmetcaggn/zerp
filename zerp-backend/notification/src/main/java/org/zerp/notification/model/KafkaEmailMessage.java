package org.zerp.notification.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Kafka topic'ten alınacak email mesaj modeli
 * 
 * Topic'e gönderilecek JSON formatı:
 * 
 * Tek kişiye mail için:
 * {
 *   "type": "SINGLE",
 *   "to": "user@example.com",
 *   "subject": "Mail Konusu",
 *   "body": "Mail içeriği",
 *   "htmlBody": null
 * }
 * 
 * Listeye mail için:
 * {
 *   "type": "LIST",
 *   "toList": ["user1@example.com", "user2@example.com"],
 *   "subject": "Mail Konusu",
 *   "body": "Mail içeriği",
 *   "htmlBody": null
 * }
 * 
 * HTML mail için:
 * {
 *   "type": "HTML",
 *   "toList": ["user1@example.com", "user2@example.com"],
 *   "subject": "Mail Konusu",
 *   "body": "Plain text fallback",
 *   "htmlBody": "<h1>HTML içerik</h1>"
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KafkaEmailMessage {
    
    public enum EmailType {
        SINGLE,
        LIST,
        HTML,
        ANNOUNCEMENT
    }
    
    private EmailType type;
    private String to;
    private List<String> toList;
    private List<String> ccList;
    private String subject;
    private String body;
    private String htmlBody;
    private String senderName;
    private String template;
}
