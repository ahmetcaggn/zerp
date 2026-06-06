package org.zerp.notification.dtos.response.announcement;
 
import lombok.Builder;
import lombok.Data;
import org.zerp.common.entity.notification.AnnouncementRecipientMode;
 
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
 
@Data
@Builder
public class AnnouncementResponseDto {
    private UUID id;
    private String title;
    private String content;
    private AnnouncementRecipientMode recipientMode;
    private List<AnnouncementRecipientResponseDto> recipients;
    private Integer recipientCount;
    private UUID senderId;
    private String sender;
    private UUID createdBy;
    private LocalDateTime createdAt;
}
