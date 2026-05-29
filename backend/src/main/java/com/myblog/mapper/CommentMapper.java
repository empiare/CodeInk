package com.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.myblog.model.dto.CommentAdminDTO;
import com.myblog.model.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {

    @Select("SELECT * FROM comments WHERE article_id = #{articleId} AND is_approved = 1 ORDER BY created_at ASC")
    List<Comment> selectByArticleId(@Param("articleId") Long articleId);

    @Select("SELECT c.id, c.article_id, c.parent_id, c.user_id, c.author_name, c.author_email, c.content, c.is_approved, c.created_at, a.title AS article_title FROM comments c LEFT JOIN articles a ON c.article_id = a.id ORDER BY c.created_at DESC")
    IPage<CommentAdminDTO> selectAllWithPagination(Page<CommentAdminDTO> page);

    @Select("SELECT DATE_FORMAT(created_at, '%H:00') AS time_label, COUNT(*) AS count FROM comments WHERE created_at >= #{startTime} GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countByHour(@Param("startTime") LocalDateTime startTime);

    @Select("SELECT DATE_FORMAT(created_at, '%m-%d') AS time_label, COUNT(*) AS count FROM comments WHERE created_at >= #{startTime} GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countByDay(@Param("startTime") LocalDateTime startTime);

    @Select("SELECT DATE_FORMAT(created_at, '%Y-%m') AS time_label, COUNT(*) AS count FROM comments WHERE created_at >= #{startTime} GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countByMonth(@Param("startTime") LocalDateTime startTime);
}
