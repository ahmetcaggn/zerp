package org.zerp.notification.dtos.request.announcement;
 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.zerp.common.entity.notification.AnnouncementRecipientMode;
 
import java.util.List;
import java.util.UUID;
 
@Data
public class CreateAnnouncementRequestDto {
    @NotBlank
    @Size(max = 200)
    private String title;
 
    @NotBlank
    private String content;
 
    @NotNull
    private AnnouncementRecipientMode recipientMode;
 
    private List<UUID> employeeIds;
}
