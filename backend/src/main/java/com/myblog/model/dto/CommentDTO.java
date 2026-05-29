package com.myblog.model.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private Long articleId;
    private Long parentId;
    private Long userId;
    private String authorName;
    private String authorEmail;
    private String content;
    private Boolean approved;
    private LocalDateTime createdAt;
    private String userAvatarUrl;
}
