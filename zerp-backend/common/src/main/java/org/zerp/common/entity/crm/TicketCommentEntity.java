package org.zerp.common.entity.crm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ticket_comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE ticket_comment SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.TICKET_COMMENT)
public class TicketCommentEntity extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private AppUser author;

    @Column(name = "author_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AuthorType authorType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_internal", nullable = false)
    private Boolean isInternal;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketAttachmentEntity> attachments = new ArrayList<>();

    @Override
    public String getTitle() {
        String content = getContent();
        if (content == null) content = "";
        if (author == null) {
            return String.format("Comment: %s", content.length() > 20 ? content.substring(0, 20) + "..." : content);
        }
        return String.format(
                "%s: %s",
                author.getTitle(),
                content.length() > 20 ? content.substring(0, 20) + "..." : content);
    }

    @Override
    public Permittable getParent() {
        return ticket;
    }

    public enum AuthorType {
        CUSTOMER, AGENT, SYSTEM
    }
}
