package com.myblog.service;

import com.myblog.mapper.ArticleMapper;
import com.myblog.mapper.CategoryMapper;
import com.myblog.mapper.TagMapper;
import com.myblog.model.dto.StatsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private TagMapper tagMapper;

    public StatsDTO getStats() {
        StatsDTO stats = new StatsDTO();
        stats.setArticleCount(articleMapper.selectCount(null));
        stats.setCategoryCount(categoryMapper.selectCount(null));
        stats.setTagCount(tagMapper.selectCount(null));

        // 计算总阅读量
        Long totalViews = articleMapper.getTotalViews();
        stats.setTotalViews(totalViews != null ? totalViews : 0L);

        return stats;
    }
}
