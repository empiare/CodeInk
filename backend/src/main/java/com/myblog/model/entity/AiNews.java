package com.myblog.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("ai_news")
public class AiNews {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String url;
    private String summary;
    private String content;
    private String coverImage;
    private String sourceName;
    private String sourceKey;
    private String author;
    private LocalDateTime publishedAt;
    private LocalDateTime fetchedAt;
    @TableField("is_visible")
    private Boolean isVisible;
    @TableField("is_deleted")
    private Integer isDeleted;
    private Integer viewCount;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
