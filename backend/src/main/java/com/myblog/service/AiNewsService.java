package com.myblog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.myblog.mapper.AiNewsMapper;
import com.myblog.mapper.AiNewsSourceMapper;
import com.myblog.model.entity.AiNews;
import com.myblog.model.entity.AiNewsSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiNewsService {

    @Autowired
    private AiNewsMapper aiNewsMapper;

    @Autowired
    private AiNewsSourceMapper aiNewsSourceMapper;

    /**
     * 获取分页资讯列表（前端用）
     */
    public IPage<AiNews> getVisiblePage(int page, int size) {
        Page<AiNews> pageParam = new Page<>(page, size);
        return aiNewsMapper.selectVisiblePage(pageParam);
    }

    /**
     * 获取最新N条资讯（首页展示用）
     */
    public List<AiNews> getLatest(int limit) {
        return aiNewsMapper.selectLatest(limit);
    }

    /**
     * 按来源筛选
     */
    public IPage<AiNews> getBySource(String sourceKey, int page, int size) {
        Page<AiNews> pageParam = new Page<>(page, size);
        return aiNewsMapper.selectBySourceKey(pageParam, sourceKey);
    }

    /**
     * 获取所有启用的来源列表
     */
    public List<AiNewsSource> getAllSources() {
        return aiNewsSourceMapper.selectEnabledSources();
    }

    /**
     * 获取所有来源的key列表
     */
    public List<String> getAllSourceKeys() {
        return aiNewsSourceMapper.selectEnabledSources().stream()
                .map(AiNewsSource::getSourceKey)
                .collect(Collectors.toList());
    }

    /**
     * 保存一条资讯（去重）
     */
    public boolean saveIfNotExists(AiNews news) {
        AiNews existing = aiNewsMapper.selectByUrl(news.getUrl());
        if (existing == null) {
            return aiNewsMapper.insert(news) > 0;
        }
        return false;
    }

    /**
     * 批量保存（去重）
     */
    public int saveAll(List<AiNews> newsList) {
        int count = 0;
        for (AiNews news : newsList) {
            if (saveIfNotExists(news)) {
                count++;
            }
        }
        return count;
    }
}
