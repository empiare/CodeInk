package com.myblog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.myblog.model.dto.ApiResponse;
import com.myblog.model.dto.ArticleDTO;
import com.myblog.model.dto.ArticleSummaryDTO;
import com.myblog.model.dto.FeatureRequest;
import com.myblog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ApiResponse<IPage<ArticleSummaryDTO>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(articleService.getPublishedPage(page, size));
    }

    @GetMapping("/all")
    public ApiResponse<IPage<ArticleSummaryDTO>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(articleService.getAllPage(page, size));
    }

    @GetMapping("/featured")
    public ApiResponse<List<ArticleSummaryDTO>> featured(
            @RequestParam(defaultValue = "3") int limit) {
        return ApiResponse.ok(articleService.getFeatured(limit));
    }

    @GetMapping("/{slug}")
    public ApiResponse<ArticleDTO> getBySlug(@PathVariable String slug) {
        return ApiResponse.ok(articleService.getBySlug(slug));
    }

    @GetMapping("/id/{id}")
    public ApiResponse<ArticleDTO> getById(@PathVariable Long id) {
        return ApiResponse.ok(articleService.getById(id));
    }

    @GetMapping("/category/{slug}")
    public ApiResponse<IPage<ArticleSummaryDTO>> byCategory(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(articleService.getByCategorySlug(slug, page, size));
    }

    @GetMapping("/tag/{slug}")
    public ApiResponse<IPage<ArticleSummaryDTO>> byTag(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(articleService.getByTagSlug(slug, page, size));
    }

    @PostMapping
    public ApiResponse<ArticleDTO> create(@RequestBody ArticleDTO dto) {
        return ApiResponse.ok(articleService.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<ArticleDTO> update(@PathVariable Long id, @RequestBody ArticleDTO dto) {
        return ApiResponse.ok(articleService.update(id, dto));
    }

    @PutMapping("/{id}/feature")
    public ApiResponse<ArticleDTO> feature(@PathVariable Long id, @RequestBody FeatureRequest req) {
        return ApiResponse.ok(articleService.feature(id, req.isFeatured()));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        articleService.delete(id);
        return ApiResponse.ok();
    }
}
