package org.zerp.common.entity.notification;
 
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
 
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
 
@Entity
@Table(name = "announcements")
@Getter
@Setter
@SQLDelete(sql = "UPDATE announcements SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
public class Announcement extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
 
    @Column(nullable = false, length = 200)
    private String title;
 
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
 
    @Column(name = "sender_id", nullable = false, updatable = false)
    private UUID senderId;
 
    @Column(name = "sender_name", nullable = false, length = 200)
    private String senderName;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnnouncementRecipientMode recipientMode;
 
    @Column(name = "recipient_count")
    private Integer recipientCount;
 
    @ElementCollection
    @CollectionTable(name = "announcement_recipients", joinColumns = @JoinColumn(name = "announcement_id"))
    @OrderColumn(name = "recipient_order")
    private List<AnnouncementRecipientSnapshot> recipients = new ArrayList<>();
}
