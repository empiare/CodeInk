package com.myblog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.myblog.model.dto.ApiResponse;
import com.myblog.model.dto.ArticleSummaryDTO;
import com.myblog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ApiResponse<IPage<ArticleSummaryDTO>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(articleService.search(q, page, size));
    }

    @GetMapping("/advanced")
    public ApiResponse<IPage<ArticleSummaryDTO>> advancedSearch(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(articleService.advancedSearch(q, category, tag, page, size));
    }
}
