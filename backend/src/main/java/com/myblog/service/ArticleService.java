package com.myblog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.myblog.exception.ResourceNotFoundException;
import com.myblog.mapper.ArticleMapper;
import com.myblog.mapper.ArticleTagMapper;
import com.myblog.mapper.CategoryMapper;
import com.myblog.mapper.TagMapper;
import com.myblog.model.dto.ArticleDTO;
import com.myblog.model.dto.ArticleSummaryDTO;
import com.myblog.model.dto.CategoryDTO;
import com.myblog.model.dto.TagDTO;
import com.myblog.model.entity.Article;
import com.myblog.model.entity.ArticleTag;
import com.myblog.model.entity.Category;
import com.myblog.model.entity.Tag;
import com.myblog.util.SlugUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArticleService {

    @Autowired
    private ArticleMapper articleMapper;
    @Autowired
    private ArticleTagMapper articleTagMapper;
    @Autowired
    private CategoryMapper categoryMapper;
    @Autowired
    private TagMapper tagMapper;

    public IPage<ArticleSummaryDTO> getPublishedPage(int page, int size) {
        IPage<Article> pageResult = articleMapper.selectPublishedPage(new Page<>(page, size));
        return pageResult.convert(this::toSummaryDTO);
    }

    public ArticleDTO getBySlug(String slug) {
        Article article = articleMapper.selectBySlug(slug);
        if (article == null) throw new ResourceNotFoundException("文章不存在");
        article.setViewCount(article.getViewCount() + 1);
        articleMapper.updateById(article);
        return toDetailDTO(article);
    }

    public ArticleDTO getById(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) throw new ResourceNotFoundException("文章不存在");
        return toDetailDTO(article);
    }

    public List<ArticleSummaryDTO> getFeatured(int limit) {
        return articleMapper.selectFeatured(limit).stream().map(this::toSummaryDTO).toList();
    }

    public IPage<ArticleSummaryDTO> getByCategorySlug(String slug, int page, int size) {
        Category category = categoryMapper.selectOne(
                new LambdaQueryWrapper<Category>().eq(Category::getSlug, slug));
        if (category == null) throw new ResourceNotFoundException("分类不存在");
        return articleMapper.selectByCategoryId(new Page<>(page, size), category.getId())
                .convert(this::toSummaryDTO);
    }

    public IPage<ArticleSummaryDTO> getByTagSlug(String slug, int page, int size) {
        Tag tag = tagMapper.selectOne(new LambdaQueryWrapper<Tag>().eq(Tag::getSlug, slug));
        if (tag == null) throw new ResourceNotFoundException("标签不存在");
        return articleMapper.selectByTagId(new Page<>(page, size), tag.getId())
                .convert(this::toSummaryDTO);
    }

    public IPage<ArticleSummaryDTO> search(String keyword, int page, int size) {
        return articleMapper.search(new Page<>(page, size), keyword).convert(this::toSummaryDTO);
    }

    public IPage<ArticleSummaryDTO> getAllPage(int page, int size) {
        IPage<Article> pageResult = articleMapper.selectPage(
                new Page<>(page, size),
                new LambdaQueryWrapper<Article>().orderByDesc(Article::getCreatedAt));
        return pageResult.convert(this::toSummaryDTO);
    }

    @Transactional
    public ArticleDTO create(ArticleDTO dto) {
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setSlug(SlugUtil.toSlugWithTimestamp(dto.getTitle()));
        article.setContent(dto.getContent());
        article.setSummary(dto.getSummary());
        article.setCoverImage(dto.getCoverImage());
        article.setCategoryId(dto.getCategoryId());
        article.setIsPublished(dto.getPublished() != null && dto.getPublished());
        article.setIsFeatured(dto.getFeatured() != null && dto.getFeatured());
        article.setViewCount(0);
        article.setCreatedAt(LocalDateTime.now());
        article.setUpdatedAt(LocalDateTime.now());
        if (article.getIsPublished()) article.setPublishedAt(LocalDateTime.now());
        articleMapper.insert(article);
        saveArticleTags(article.getId(), dto.getTagIds());
        return toDetailDTO(article);
    }

    @Transactional
    public ArticleDTO update(Long id, ArticleDTO dto) {
        Article article = articleMapper.selectById(id);
        if (article == null) throw new ResourceNotFoundException("文章不存在");
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setSummary(dto.getSummary());
        article.setCoverImage(dto.getCoverImage());
        article.setCategoryId(dto.getCategoryId());
        boolean wasPublished = Boolean.TRUE.equals(article.getIsPublished());
        article.setIsPublished(dto.getPublished() != null && dto.getPublished());
        article.setIsFeatured(dto.getFeatured() != null && dto.getFeatured());
        article.setUpdatedAt(LocalDateTime.now());
        if (!wasPublished && article.getIsPublished()) article.setPublishedAt(LocalDateTime.now());
        articleMapper.updateById(article);
        articleTagMapper.deleteByArticleId(id);
        saveArticleTags(id, dto.getTagIds());
        return toDetailDTO(article);
    }

    @Transactional
    public void delete(Long id) {
        articleTagMapper.deleteByArticleId(id);
        articleMapper.deleteById(id);
    }

    private void saveArticleTags(Long articleId, List<Long> tagIds) {
        if (tagIds == null) return;
        for (Long tagId : tagIds) {
            ArticleTag at = new ArticleTag();
            at.setArticleId(articleId);
            at.setTagId(tagId);
            articleTagMapper.insert(at);
        }
    }

    private ArticleSummaryDTO toSummaryDTO(Article a) {
        ArticleSummaryDTO dto = new ArticleSummaryDTO();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setSlug(a.getSlug());
        dto.setSummary(a.getSummary());
        dto.setCoverImage(a.getCoverImage());
        dto.setPublished(a.getIsPublished());
        dto.setFeatured(a.getIsFeatured());
        dto.setViewCount(a.getViewCount());
        dto.setPublishedAt(a.getPublishedAt());
        if (a.getCategoryId() != null) {
            Category cat = categoryMapper.selectById(a.getCategoryId());
            if (cat != null) {
                CategoryDTO catDto = new CategoryDTO();
                catDto.setId(cat.getId());
                catDto.setName(cat.getName());
                catDto.setSlug(cat.getSlug());
                catDto.setDescription(cat.getDescription());
                dto.setCategory(catDto);
            }
        }
        dto.setTags(getTagDTOs(a.getId()));
        return dto;
    }

    private ArticleDTO toDetailDTO(Article a) {
        ArticleDTO dto = new ArticleDTO();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setSlug(a.getSlug());
        dto.setContent(a.getContent());
        dto.setSummary(a.getSummary());
        dto.setCoverImage(a.getCoverImage());
        dto.setCategoryId(a.getCategoryId());
        dto.setPublished(a.getIsPublished());
        dto.setFeatured(a.getIsFeatured());
        dto.setViewCount(a.getViewCount());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        dto.setPublishedAt(a.getPublishedAt());
        if (a.getCategoryId() != null) {
            Category cat = categoryMapper.selectById(a.getCategoryId());
            if (cat != null) {
                CategoryDTO catDto = new CategoryDTO();
                catDto.setId(cat.getId());
                catDto.setName(cat.getName());
                catDto.setSlug(cat.getSlug());
                catDto.setDescription(cat.getDescription());
                dto.setCategory(catDto);
            }
        }
        dto.setTags(getTagDTOs(a.getId()));
        return dto;
    }

    private List<TagDTO> getTagDTOs(Long articleId) {
        List<Long> tagIds = articleTagMapper.selectTagIdsByArticleId(articleId);
        if (tagIds.isEmpty()) return List.of();
        return tagMapper.selectBatchIds(tagIds).stream().map(t -> {
            TagDTO td = new TagDTO();
            td.setId(t.getId());
            td.setName(t.getName());
            td.setSlug(t.getSlug());
            return td;
        }).toList();
    }
}
