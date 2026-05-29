package com.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myblog.model.entity.AiNews;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

@Mapper
public interface AiNewsMapper extends BaseMapper<AiNews> {

    @Select("SELECT * FROM ai_news WHERE is_visible = 1 AND is_deleted = 0 ORDER BY published_at DESC")
    IPage<AiNews> selectVisiblePage(Page<AiNews> page);

    @Select("SELECT * FROM ai_news WHERE is_visible = 1 AND is_deleted = 0 ORDER BY published_at DESC LIMIT #{limit}")
    List<AiNews> selectLatest(@Param("limit") int limit);

    @Select("SELECT * FROM ai_news WHERE is_visible = 1 AND is_deleted = 0 AND source_key = #{sourceKey} ORDER BY published_at DESC")
    IPage<AiNews> selectBySourceKey(Page<AiNews> page, @Param("sourceKey") String sourceKey);

    @Select("<script>" +
            "SELECT * FROM ai_news WHERE is_visible = 1 AND is_deleted = 0 " +
            "<if test='startDate != null and startDate != \"\"'> AND published_at &gt;= #{startDate}</if>" +
            "<if test='endDate != null and endDate != \"\"'> AND published_at &lt;= #{endDate}</if>" +
            " ORDER BY published_at DESC" +
            "</script>")
    IPage<AiNews> selectVisiblePageByTimeRange(Page<AiNews> page,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);

    @Select("<script>" +
            "SELECT * FROM ai_news WHERE is_visible = 1 AND is_deleted = 0 " +
            "<if test='startDate != null and startDate != \"\"'> AND published_at &gt;= #{startDate}</if>" +
            "<if test='endDate != null and endDate != \"\"'> AND published_at &lt;= #{endDate}</if>" +
            "<if test='sourceKeys != null and sourceKeys.size() > 0'>" +
            " AND source_key IN " +
            "<foreach collection='sourceKeys' item='key' open='(' separator=',' close=')'>#{key}</foreach>" +
            "</if>" +
            " ORDER BY published_at DESC" +
            "</script>")
    IPage<AiNews> selectVisiblePageWithFilter(Page<AiNews> page,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("sourceKeys") List<String> sourceKeys);

    @Select("SELECT * FROM ai_news WHERE url = #{url} AND is_deleted = 0 LIMIT 1")
    AiNews selectByUrl(@Param("url") String url);

    @Select("<script>" +
            "SELECT url FROM ai_news WHERE is_deleted = 0 AND url IN " +
            "<foreach collection='urls' item='url' open='(' separator=',' close=')'>" +
            "#{url}" +
            "</foreach>" +
            "</script>")
    List<String> selectExistingUrls(@Param("urls") List<String> urls);

    @Select("SELECT id, title FROM ai_news WHERE is_deleted = 0 AND is_visible = 1")
    List<AiNews> selectVisibleForTranslation();
}
