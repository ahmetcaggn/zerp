package org.pomocra.socket_service.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class PrivacyEventSubscriber implements MessageListener {
    private final ObjectMapper objectMapper;
//    private final PrivacyPresenceHandler privacyPresenceHandler;

    @Override
    public void onMessage(Message message, byte[] pattern) {
//        try {
//            String json = new String(message.getBody(), StandardCharsets.UTF_8);
//
//            PrivacySettingChangedEvent event =
//                    objectMapper.readValue(json, PrivacySettingChangedEvent.class);
//
//            privacyPresenceHandler.handlePrivacyChange(
//                    event.userId(),
//                    event.presenceStatus()
//            );
//
//        } catch (Exception e) {
//            // Log the error but don't rethrow, to avoid crashing the listener
//            log.error("Privacy event parse failed", e);
//        }
    }
}
