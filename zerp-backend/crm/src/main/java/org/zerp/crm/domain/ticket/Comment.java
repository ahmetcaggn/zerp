package org.zerp.crm.domain.ticket;

import java.time.LocalDateTime;
import java.util.Objects;

public class Comment {
    
    private Integer id;
    private final Integer authorId;
    private final AuthorType authorType;
    private final String content;
    private final boolean isInternal;
    private final LocalDateTime createdAt;
    
    public enum AuthorType {
        CUSTOMER, AGENT, SYSTEM
    }
    
    private Comment(Integer authorId, AuthorType authorType, String content, boolean isInternal, LocalDateTime createdAt) {
        this.authorId = Objects.requireNonNull(authorId, "Author ID cannot be null");
        this.authorType = Objects.requireNonNull(authorType, "Author type cannot be null");
        this.content = validateContent(content);
        this.isInternal = isInternal;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
    
    public static Comment create(Integer authorId, AuthorType authorType, String content, boolean isInternal) {
        return new Comment(authorId, authorType, content, isInternal, LocalDateTime.now());
    }
    
    public static Comment systemComment(String content) {
        return new Comment(0, AuthorType.SYSTEM, content, true, LocalDateTime.now());
    }
    
    private String validateContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        if (content.length() > 10000) {
            throw new IllegalArgumentException("Comment content is too long (max 10000 characters)");
        }
        return content.trim();
    }
    
    // Getters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Integer getAuthorId() {
        return authorId;
    }
    
    public AuthorType getAuthorType() {
        return authorType;
    }
    
    public String getContent() {
        return content;
    }
    
    public boolean isInternal() {
        return isInternal;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
