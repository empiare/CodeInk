package com.myblog.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("comments")
public class Comment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long articleId;
    private Long parentId;
    private Long userId;
    private String authorName;
    private String authorEmail;
    private String content;
    @TableField("is_approved")
    private Boolean isApproved;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
