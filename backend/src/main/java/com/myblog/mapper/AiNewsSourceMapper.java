package com.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myblog.model.entity.AiNewsSource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AiNewsSourceMapper extends BaseMapper<AiNewsSource> {

    @Select("SELECT * FROM ai_news_source WHERE enabled = 1 ORDER BY sort_order ASC")
    List<AiNewsSource> selectEnabledSources();

    @Select("SELECT * FROM ai_news_source WHERE source_key = #{sourceKey} LIMIT 1")
    AiNewsSource selectBySourceKey(@Param("sourceKey") String sourceKey);
}
