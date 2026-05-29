package com.myblog.model.dto;

import lombok.Data;

@Data
public class StatsDTO {
    private Long articleCount;
    private Long categoryCount;
    private Long tagCount;
    private Long totalViews;
    private Long commentCount;
}
