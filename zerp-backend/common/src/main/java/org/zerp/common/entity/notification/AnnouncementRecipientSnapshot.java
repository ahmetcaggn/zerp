package org.zerp.common.entity.notification;
 
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
 
import java.util.UUID;
 
@Embeddable
@Getter
@Setter
public class AnnouncementRecipientSnapshot {
    @Column(name = "employee_id")
    private UUID employeeId;
 
    @Column(name = "display_name", length = 200)
    private String displayName;
 
    @Column(name = "email", nullable = false)
    private String email;
}
