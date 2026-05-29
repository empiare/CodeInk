package com.myblog.model.dto;

import lombok.Data;

@Data
public class TimeStatsDTO {
    private String period;
    private Long articleCount;
    private Long commentCount;
    private Long articleViewCount;
    private Long pageVisitCount;
}
