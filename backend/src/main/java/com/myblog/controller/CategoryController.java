package com.myblog.controller;

import com.myblog.model.dto.ApiResponse;
import com.myblog.model.dto.CategoryDTO;
import com.myblog.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryDTO>> list() {
        return ApiResponse.ok(categoryService.list());
    }

    @PostMapping
    public ApiResponse<CategoryDTO> create(@RequestBody CategoryDTO dto) {
        return ApiResponse.ok(categoryService.create(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryDTO> update(@PathVariable Long id, @RequestBody CategoryDTO dto) {
        return ApiResponse.ok(categoryService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.ok();
    }
}
