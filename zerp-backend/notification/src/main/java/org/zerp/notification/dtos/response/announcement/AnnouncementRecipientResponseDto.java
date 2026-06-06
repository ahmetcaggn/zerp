package org.zerp.notification.dtos.response.announcement;
 
import lombok.Builder;
import lombok.Data;
 
import java.util.UUID;
 
@Data
@Builder
public class AnnouncementRecipientResponseDto {
    private UUID employeeId;
    private String displayName;
    private String email;
}
