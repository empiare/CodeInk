package com.myblog.service;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.myblog.exception.ResourceNotFoundException;
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

    public IPage<AiNews> getVisiblePage(int page, int size) {
        Page<AiNews> pageParam = new Page<>(page + 1, size);
        return aiNewsMapper.selectVisiblePage(pageParam);
    }

    public List<AiNews> getLatest(int limit) {
        return aiNewsMapper.selectLatest(limit);
    }

    public IPage<AiNews> getVisiblePageByTimeRange(int page, int size, String startDate, String endDate) {
        Page<AiNews> pageParam = new Page<>(page + 1, size);
        return aiNewsMapper.selectVisiblePageByTimeRange(pageParam, startDate, endDate);
    }

    public IPage<AiNews> getByFilter(int page, int size, String startDate, String endDate, List<String> sourceKeys) {
        Page<AiNews> pageParam = new Page<>(page + 1, size);
        return aiNewsMapper.selectVisiblePageWithFilter(pageParam, startDate, endDate, sourceKeys);
    }

    public IPage<AiNews> getBySource(String sourceKey, int page, int size) {
        Page<AiNews> pageParam = new Page<>(page + 1, size);
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
     * 逻辑删除资讯（将 is_deleted 设为 1）
     */
    public void delete(Long id) {
        AiNews news = aiNewsMapper.selectById(id);
        if (news == null) {
            throw new ResourceNotFoundException("资讯不存在");
        }
        LambdaUpdateWrapper<AiNews> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(AiNews::getId, id).set(AiNews::getIsDeleted, 1);
        aiNewsMapper.update(null, wrapper);
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
