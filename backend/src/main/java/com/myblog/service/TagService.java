package com.myblog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.myblog.exception.ResourceNotFoundException;
import com.myblog.mapper.TagMapper;
import com.myblog.model.dto.TagDTO;
import com.myblog.model.entity.Tag;
import com.myblog.util.SlugUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TagService {

    @Autowired
    private TagMapper tagMapper;

    public List<TagDTO> list() {
        return tagMapper.selectList(new LambdaQueryWrapper<Tag>().orderByAsc(Tag::getId))
                .stream().map(this::toDTO).toList();
    }

    public TagDTO create(TagDTO dto) {
        Tag entity = new Tag();
        entity.setName(dto.getName());
        entity.setSlug(SlugUtil.toSlug(dto.getName()));
        entity.setCreatedAt(LocalDateTime.now());
        tagMapper.insert(entity);
        return toDTO(entity);
    }

    public void delete(Long id) {
        Tag tag = tagMapper.selectById(id);
        if (tag == null) throw new ResourceNotFoundException("标签不存在");
        tagMapper.deleteById(id);
    }

    private TagDTO toDTO(Tag t) {
        TagDTO dto = new TagDTO();
        dto.setId(t.getId());
        dto.setName(t.getName());
        dto.setSlug(t.getSlug());
        return dto;
    }
}
