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

    @Select("SELECT * FROM ai_news WHERE is_visible = 1 ORDER BY published_at DESC")
    IPage<AiNews> selectVisiblePage(Page<AiNews> page);

    @Select("SELECT * FROM ai_news WHERE is_visible = 1 ORDER BY published_at DESC LIMIT #{limit}")
    List<AiNews> selectLatest(@Param("limit") int limit);

    @Select("SELECT * FROM ai_news WHERE is_visible = 1 AND source_key = #{sourceKey} ORDER BY published_at DESC")
    IPage<AiNews> selectBySourceKey(Page<AiNews> page, @Param("sourceKey") String sourceKey);

    @Select("SELECT * FROM ai_news WHERE url = #{url} LIMIT 1")
    AiNews selectByUrl(@Param("url") String url);
}
