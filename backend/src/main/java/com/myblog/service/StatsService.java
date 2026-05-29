package com.myblog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.myblog.mapper.ArticleMapper;
import com.myblog.mapper.CategoryMapper;
import com.myblog.mapper.CommentMapper;
import com.myblog.mapper.PageVisitMapper;
import com.myblog.mapper.TagMapper;
import com.myblog.model.dto.StatsDTO;
import com.myblog.model.dto.TimeStatsDTO;
import com.myblog.model.dto.TrendStatsDTO;
import com.myblog.model.entity.Article;
import com.myblog.model.entity.Comment;
import com.myblog.model.entity.PageVisit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private PageVisitMapper pageVisitMapper;

    public StatsDTO getStats() {
        StatsDTO stats = new StatsDTO();
        stats.setArticleCount(articleMapper.selectCount(null));
        stats.setCategoryCount(categoryMapper.selectCount(null));
        stats.setTagCount(tagMapper.selectCount(null));
        stats.setCommentCount(commentMapper.selectCount(null));

        // 计算总阅读量
        Long totalViews = articleMapper.getTotalViews();
        stats.setTotalViews(totalViews != null ? totalViews : 0L);

        return stats;
    }

    public TimeStatsDTO getTimeStats(String period) {
        LocalDateTime startTime = switch (period) {
            case "24h"   -> LocalDateTime.now().minusHours(24);
            case "day"   -> LocalDateTime.now().with(LocalTime.MIN);
            case "month" -> LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
            case "year"  -> LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
            default       -> LocalDateTime.now().minusHours(24);
        };

        TimeStatsDTO dto = new TimeStatsDTO();
        dto.setPeriod(period);
        dto.setArticleCount(articleMapper.selectCount(
            new LambdaQueryWrapper<Article>().ge(Article::getCreatedAt, startTime)));
        dto.setCommentCount(commentMapper.selectCount(
            new LambdaQueryWrapper<Comment>().ge(Comment::getCreatedAt, startTime)));
        dto.setArticleViewCount(pageVisitMapper.selectCount(
            new LambdaQueryWrapper<PageVisit>()
                .ge(PageVisit::getVisitedAt, startTime)
                .likeRight(PageVisit::getPagePath, "/articles")));
        dto.setPageVisitCount(pageVisitMapper.selectCount(
            new LambdaQueryWrapper<PageVisit>().ge(PageVisit::getVisitedAt, startTime)));
        return dto;
    }

    public TrendStatsDTO getTrendStats(String range) {
        LocalDateTime now = LocalDateTime.now();
        List<String> labels;
        LocalDateTime startTime;

        switch (range) {
            case "7d" -> {
                startTime = now.minusDays(7).with(LocalTime.MIN);
                labels = generateDayLabels(startTime.toLocalDate(), 7);
            }
            case "30d" -> {
                startTime = now.minusDays(30).with(LocalTime.MIN);
                labels = generateDayLabels(startTime.toLocalDate(), 30);
            }
            case "1y" -> {
                startTime = now.minusYears(1).withDayOfMonth(1).with(LocalTime.MIN);
                labels = generateMonthLabels(startTime.toLocalDate(), 12);
            }
            default -> {
                startTime = now.minusHours(24).withMinute(0).withSecond(0).withNano(0);
                labels = generateHourLabels();
                range = "24h";
            }
        }

        TrendStatsDTO dto = new TrendStatsDTO();
        dto.setLabels(labels);

        List<Map<String, Object>> commentData;
        List<Map<String, Object>> pageVisitData;
        List<Map<String, Object>> articleViewData;

        if ("24h".equals(range)) {
            commentData = commentMapper.countByHour(startTime);
            pageVisitData = pageVisitMapper.countByHour(startTime);
            articleViewData = pageVisitMapper.countArticleByHour(startTime);
        } else if ("1y".equals(range)) {
            commentData = commentMapper.countByMonth(startTime);
            pageVisitData = pageVisitMapper.countByMonth(startTime);
            articleViewData = pageVisitMapper.countArticleByMonth(startTime);
        } else {
            commentData = commentMapper.countByDay(startTime);
            pageVisitData = pageVisitMapper.countByDay(startTime);
            articleViewData = pageVisitMapper.countArticleByDay(startTime);
        }

        dto.setCommentCounts(fillZeros(labels, commentData));
        dto.setPageVisitCounts(fillZeros(labels, pageVisitData));
        dto.setArticleViewCounts(fillZeros(labels, articleViewData));
        return dto;
    }

    private List<Long> fillZeros(List<String> labels, List<Map<String, Object>> data) {
        Map<String, Long> dataMap = new HashMap<>();
        for (Map<String, Object> row : data) {
            String label = (String) row.get("time_label");
            Long count = ((Number) row.get("count")).longValue();
            dataMap.put(label, count);
        }
        List<Long> result = new ArrayList<>(labels.size());
        for (String label : labels) {
            result.add(dataMap.getOrDefault(label, 0L));
        }
        return result;
    }

    private List<String> generateHourLabels() {
        List<String> labels = new ArrayList<>(24);
        for (int h = 0; h < 24; h++) {
            labels.add(String.format("%02d:00", h));
        }
        return labels;
    }

    private List<String> generateDayLabels(LocalDate start, int days) {
        List<String> labels = new ArrayList<>(days);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM-dd");
        for (int d = 0; d < days; d++) {
            labels.add(start.plusDays(d).format(fmt));
        }
        return labels;
    }

    private List<String> generateMonthLabels(LocalDate start, int months) {
        List<String> labels = new ArrayList<>(months);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        for (int m = 0; m < months; m++) {
            labels.add(start.plusMonths(m).format(fmt));
        }
        return labels;
    }
}
