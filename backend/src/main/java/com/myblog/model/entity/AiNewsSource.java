package com.myblog.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("ai_news_source")
public class AiNewsSource {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String sourceKey;
    private String sourceName;
    private String feedUrl;
    private String feedType;
    private Boolean enabled;
    private LocalDateTime lastFetchedAt;
    private Integer sortOrder;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
