package com.myblog.model.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ArticleSummaryDTO {
    private Long id;
    private String title;
    private String slug;
    private String summary;
    private String coverImage;
    private CategoryDTO category;
    private List<TagDTO> tags;
    private Boolean published;
    private Boolean featured;
    private Integer viewCount;
    private LocalDateTime publishedAt;
}
