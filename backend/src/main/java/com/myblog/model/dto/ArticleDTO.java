package com.myblog.model.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ArticleDTO {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String summary;
    private String coverImage;
    private Long categoryId;
    private CategoryDTO category;
    private List<TagDTO> tags;
    private List<Long> tagIds;
    private Boolean published;
    private Boolean featured;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}
