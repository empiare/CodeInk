package com.myblog.controller;

import com.myblog.model.dto.ApiResponse;
import com.myblog.model.dto.CommentDTO;
import com.myblog.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/article/{articleId}")
    public ApiResponse<List<CommentDTO>> getByArticle(@PathVariable Long articleId) {
        return ApiResponse.ok(commentService.getByArticleId(articleId));
    }

    @PostMapping
    public ApiResponse<CommentDTO> create(@RequestBody CommentDTO dto, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ApiResponse.ok(commentService.create(dto, email));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        commentService.delete(id, email);
        return ApiResponse.ok();
    }
}
