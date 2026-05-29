package com.myblog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.myblog.exception.ResourceNotFoundException;
import com.myblog.mapper.ArticleMapper;
import com.myblog.mapper.CategoryMapper;
import com.myblog.model.dto.CategoryDTO;
import com.myblog.model.entity.Article;
import com.myblog.model.entity.Category;
import com.myblog.util.SlugUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ArticleMapper articleMapper;

    public List<CategoryDTO> list() {
        return categoryMapper.selectList(new LambdaQueryWrapper<Category>().orderByAsc(Category::getSortOrder))
                .stream().map(this::toDTO).toList();
    }

    public CategoryDTO create(CategoryDTO dto) {
        Category entity = new Category();
        entity.setName(dto.getName());
        entity.setSlug(SlugUtil.toSlug(dto.getName()));
        entity.setDescription(dto.getDescription());
        entity.setSortOrder(0);
        entity.setCreatedAt(LocalDateTime.now());
        categoryMapper.insert(entity);
        return toDTO(entity);
    }

    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category entity = categoryMapper.selectById(id);
        if (entity == null) throw new ResourceNotFoundException("分类不存在");
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        categoryMapper.updateById(entity);
        return toDTO(entity);
    }

    public void delete(Long id) {
        categoryMapper.deleteById(id);
    }

    private CategoryDTO toDTO(Category c) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setSlug(c.getSlug());
        dto.setDescription(c.getDescription());
        long count = articleMapper.selectCount(
                new LambdaQueryWrapper<Article>()
                        .eq(Article::getCategoryId, c.getId())
                        .eq(Article::getIsPublished, true));
        dto.setArticleCount((int) count);
        return dto;
    }
}
