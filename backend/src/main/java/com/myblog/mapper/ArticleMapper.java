package com.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myblog.model.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {

    @Select("SELECT a.* FROM articles a WHERE a.is_published = 1 ORDER BY a.published_at DESC")
    IPage<Article> selectPublishedPage(Page<Article> page);

    @Select("SELECT a.* FROM articles a WHERE a.slug = #{slug} AND a.is_published = 1")
    Article selectBySlug(@Param("slug") String slug);

    @Select("SELECT a.* FROM articles a WHERE a.is_published = 1 AND a.is_featured = 1 ORDER BY a.published_at DESC LIMIT #{limit}")
    List<Article> selectFeatured(@Param("limit") int limit);

    @Select("SELECT a.* FROM articles a " +
            "INNER JOIN article_tags at2 ON a.id = at2.article_id " +
            "WHERE at2.tag_id = #{tagId} AND a.is_published = 1 " +
            "ORDER BY a.published_at DESC")
    IPage<Article> selectByTagId(Page<Article> page, @Param("tagId") Long tagId);

    @Select("SELECT a.* FROM articles a WHERE a.category_id = #{categoryId} AND a.is_published = 1 ORDER BY a.published_at DESC")
    IPage<Article> selectByCategoryId(Page<Article> page, @Param("categoryId") Long categoryId);

    @Select("SELECT a.* FROM articles a WHERE a.is_published = 1 " +
            "AND (a.title LIKE CONCAT('%',#{keyword},'%') OR a.summary LIKE CONCAT('%',#{keyword},'%')) " +
            "ORDER BY a.published_at DESC")
    IPage<Article> search(Page<Article> page, @Param("keyword") String keyword);

    @Select("<script>" +
            "SELECT a.* FROM articles a WHERE a.is_published = 1 " +
            "<if test='keyword != null and keyword != \"\"'>" +
            "AND (a.title LIKE CONCAT('%',#{keyword},'%') OR a.summary LIKE CONCAT('%',#{keyword},'%'))" +
            "</if>" +
            "<if test='categorySlug != null and categorySlug != \"\"'>" +
            "AND a.category_id IN (SELECT id FROM categories WHERE slug = #{categorySlug})" +
            "</if>" +
            "<if test='tagSlug != null and tagSlug != \"\"'>" +
            "AND a.id IN (SELECT article_id FROM article_tags at2 JOIN tags t ON at2.tag_id = t.id WHERE t.slug = #{tagSlug})" +
            "</if>" +
            "ORDER BY a.published_at DESC" +
            "</script>")
    IPage<Article> advancedSearch(Page<Article> page,
                                  @Param("keyword") String keyword,
                                  @Param("categorySlug") String categorySlug,
                                  @Param("tagSlug") String tagSlug);

    @Select("SELECT COALESCE(SUM(view_count), 0) FROM articles WHERE is_published = 1")
    Long getTotalViews();
}
