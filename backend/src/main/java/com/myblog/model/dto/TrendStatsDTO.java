package com.myblog.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class TrendStatsDTO {
    private List<String> labels;
    private List<Long> commentCounts;
    private List<Long> articleViewCounts;
    private List<Long> pageVisitCounts;
}
