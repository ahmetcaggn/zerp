package org.zerp.common.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private TicketEntity ticket;
    
    @Column(name = "author_id", nullable = false)
    private Integer authorId;
    
    @Column(name = "author_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AuthorType authorType;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(name = "is_internal", nullable = false)
    private Boolean isInternal;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    public enum AuthorType {
        CUSTOMER, AGENT, SYSTEM
    }
}
