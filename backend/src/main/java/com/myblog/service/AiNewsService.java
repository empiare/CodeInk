package com.myblog.service;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.myblog.exception.ResourceNotFoundException;
import com.myblog.mapper.AiNewsMapper;
import com.myblog.mapper.AiNewsSourceMapper;
import com.myblog.model.entity.AiNews;
import com.myblog.model.entity.AiNewsSource;
import com.myblog.model.dto.AiNewsUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    /**
     * 管理后台分页查询（不过滤is_visible，可选过滤is_deleted）
     */
    public IPage<AiNews> getAdminPage(int page, int size, String startDate, String endDate,
                                       List<String> sourceKeys, boolean showDeleted) {
        Page<AiNews> pageParam = new Page<>(page + 1, size);
        return aiNewsMapper.selectAdminPage(pageParam, startDate, endDate, sourceKeys, showDeleted);
    }

    /**
     * 根据ID获取资讯详情
     */
    public AiNews getById(Long id) {
        AiNews news = aiNewsMapper.selectById(id);
        if (news == null) {
            throw new ResourceNotFoundException("资讯不存在");
        }
        return news;
    }

    /**
     * 更新资讯（标题、摘要、封面图、内容）
     */
    @Transactional
    public AiNews update(Long id, AiNewsUpdateDTO dto) {
        AiNews news = getById(id);

        if (dto.getTitle() != null) {
            news.setTitle(dto.getTitle());
        }
        if (dto.getSummary() != null) {
            news.setSummary(dto.getSummary());
        }
        if (dto.getCoverImage() != null) {
            news.setCoverImage(dto.getCoverImage());
        }
        if (dto.getContent() != null) {
            news.setContent(dto.getContent());
        }
        news.setUpdatedAt(LocalDateTime.now());

        aiNewsMapper.updateById(news);
        return news;
    }

    /**
     * 切换资讯显示/隐藏状态
     */
    @Transactional
    public AiNews toggleVisibility(Long id) {
        AiNews news = getById(id);
        news.setIsVisible(!news.getIsVisible());
        news.setUpdatedAt(LocalDateTime.now());

        LambdaUpdateWrapper<AiNews> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(AiNews::getId, id)
               .set(AiNews::getIsVisible, news.getIsVisible())
               .set(AiNews::getUpdatedAt, news.getUpdatedAt());
        aiNewsMapper.update(null, wrapper);

        return news;
    }
}
