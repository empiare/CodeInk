package com.myblog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.myblog.model.dto.AiNewsUpdateDTO;
import com.myblog.model.dto.ApiResponse;
import com.myblog.model.entity.AiNews;
import com.myblog.service.AiNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/admin/ai-news")
public class AdminAiNewsController {

    @Autowired
    private AiNewsService aiNewsService;

    /**
     * 管理后台分页列表（含所有未删除条目，支持筛选）
     */
    @GetMapping
    public ApiResponse<IPage<AiNews>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String sourceKeys,
            @RequestParam(defaultValue = "false") boolean showDeleted) {

        List<String> sourceKeyList = (sourceKeys != null && !sourceKeys.isEmpty())
                ? Arrays.asList(sourceKeys.split(","))
                : null;

        return ApiResponse.ok(aiNewsService.getAdminPage(page, size, startDate, endDate, sourceKeyList, showDeleted));
    }

    /**
     * 获取单条资讯详情（编辑用）
     */
    @GetMapping("/{id}")
    public ApiResponse<AiNews> getById(@PathVariable Long id) {
        return ApiResponse.ok(aiNewsService.getById(id));
    }

    /**
     * 更新资讯
     */
    @PutMapping("/{id}")
    public ApiResponse<AiNews> update(@PathVariable Long id, @RequestBody AiNewsUpdateDTO dto) {
        return ApiResponse.ok(aiNewsService.update(id, dto));
    }

    /**
     * 切换显示/隐藏状态
     */
    @PutMapping("/{id}/visibility")
    public ApiResponse<AiNews> toggleVisibility(@PathVariable Long id) {
        return ApiResponse.ok(aiNewsService.toggleVisibility(id));
    }

    /**
     * 逻辑删除资讯
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        aiNewsService.delete(id);
        return ApiResponse.ok(null);
    }
}
