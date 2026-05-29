package com.myblog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.myblog.model.dto.ApiResponse;
import com.myblog.model.dto.CommentAdminDTO;
import com.myblog.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/comments")
public class AdminCommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ApiResponse<IPage<CommentAdminDTO>> listAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(commentService.listAll(page, size));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        commentService.delete(id, null);
        return ApiResponse.ok();
    }
}
