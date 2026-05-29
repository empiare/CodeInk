package com.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myblog.model.entity.PageVisit;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface PageVisitMapper extends BaseMapper<PageVisit> {

    @Select("SELECT DATE_FORMAT(visited_at, '%H:00') AS time_label, COUNT(*) AS count FROM page_visits WHERE visited_at >= #{startTime} GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countByHour(@Param("startTime") LocalDateTime startTime);

    @Select("SELECT DATE_FORMAT(visited_at, '%m-%d') AS time_label, COUNT(*) AS count FROM page_visits WHERE visited_at >= #{startTime} GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countByDay(@Param("startTime") LocalDateTime startTime);

    @Select("SELECT DATE_FORMAT(visited_at, '%Y-%m') AS time_label, COUNT(*) AS count FROM page_visits WHERE visited_at >= #{startTime} GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countByMonth(@Param("startTime") LocalDateTime startTime);

    @Select("SELECT DATE_FORMAT(visited_at, '%H:00') AS time_label, COUNT(*) AS count FROM page_visits WHERE visited_at >= #{startTime} AND page_path LIKE '/articles%' GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countArticleByHour(@Param("startTime") LocalDateTime startTime);

    @Select("SELECT DATE_FORMAT(visited_at, '%m-%d') AS time_label, COUNT(*) AS count FROM page_visits WHERE visited_at >= #{startTime} AND page_path LIKE '/articles%' GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countArticleByDay(@Param("startTime") LocalDateTime startTime);

    @Select("SELECT DATE_FORMAT(visited_at, '%Y-%m') AS time_label, COUNT(*) AS count FROM page_visits WHERE visited_at >= #{startTime} AND page_path LIKE '/articles%' GROUP BY time_label ORDER BY time_label")
    List<Map<String, Object>> countArticleByMonth(@Param("startTime") LocalDateTime startTime);
}
