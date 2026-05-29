package com.myblog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.myblog.model.dto.ApiResponse;
import com.myblog.model.entity.AiNews;
import com.myblog.model.entity.AiNewsSource;
import com.myblog.service.AiNewsCrawlerService;
import com.myblog.service.AiNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/ai-news")
public class AiNewsController {

    @Autowired
    private AiNewsService aiNewsService;

    @Autowired
    private AiNewsCrawlerService aiNewsCrawlerService;

    @GetMapping
    public ApiResponse<IPage<AiNews>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String sourceKeys) {
        List<String> sourceKeyList = (sourceKeys != null && !sourceKeys.isEmpty())
                ? Arrays.asList(sourceKeys.split(","))
                : null;

        boolean hasTimeRange = (startDate != null && !startDate.isEmpty())
                || (endDate != null && !endDate.isEmpty());
        boolean hasSourceFilter = sourceKeyList != null && !sourceKeyList.isEmpty();

        if (hasTimeRange || hasSourceFilter) {
            return ApiResponse.ok(aiNewsService.getByFilter(page, size, startDate, endDate, sourceKeyList));
        }
        return ApiResponse.ok(aiNewsService.getVisiblePage(page, size));
    }

    /**
     * 获取最新N条资讯（首页用）
     */
    @GetMapping("/latest")
    public ApiResponse<List<AiNews>> latest(
            @RequestParam(defaultValue = "6") int limit) {
        return ApiResponse.ok(aiNewsService.getLatest(limit));
    }

    /**
     * 按来源筛选资讯
     */
    @GetMapping("/source/{sourceKey}")
    public ApiResponse<IPage<AiNews>> bySource(
            @PathVariable String sourceKey,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(aiNewsService.getBySource(sourceKey, page, size));
    }

    /**
     * 获取所有来源列表
     */
    @GetMapping("/sources")
    public ApiResponse<List<AiNewsSource>> sources() {
        return ApiResponse.ok(aiNewsService.getAllSources());
    }

    /**
     * 逻辑删除资讯
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        aiNewsService.delete(id);
        return ApiResponse.ok(null);
    }

    /**
     * 手动触发爬虫（需要认证）
     */
    @PostMapping("/crawl")
    public ApiResponse<AiNewsCrawlerService.CrawlResult> triggerCrawl() {
        return ApiResponse.ok(aiNewsCrawlerService.crawlAll());
    }
}
