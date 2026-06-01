package com.myblog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.myblog.exception.ResourceNotFoundException;
import com.myblog.mapper.CommentMapper;
import com.myblog.mapper.UserMapper;
import com.myblog.model.dto.CommentAdminDTO;
import com.myblog.model.dto.CommentDTO;
import com.myblog.model.entity.Comment;
import com.myblog.model.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class CommentService {

    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private UserMapper userMapper;

    public List<CommentDTO> getByArticleId(Long articleId) {
        return commentMapper.selectByArticleId(articleId).stream().map(this::toDTO).toList();
    }

    public CommentDTO create(CommentDTO dto, String email) {
        Comment entity = new Comment();
        entity.setArticleId(dto.getArticleId());
        entity.setParentId(dto.getParentId());
        entity.setAuthorName(dto.getAuthorName());
        entity.setAuthorEmail(dto.getAuthorEmail());
        entity.setContent(dto.getContent());
        entity.setIsApproved(true);
        entity.setCreatedAt(LocalDateTime.now());

        if (email != null) {
            User user = userMapper.selectByEmail(email);
            if (user != null) {
                entity.setUserId(user.getId());
                entity.setAuthorName(user.getDisplayName());
                entity.setAuthorEmail(user.getEmail());
            }
        } else {
            User tempUser = createTempUser();
            entity.setUserId(tempUser.getId());
            if (entity.getAuthorName() == null || entity.getAuthorName().trim().isEmpty()) {
                entity.setAuthorName(tempUser.getDisplayName());
            }
        }

        commentMapper.insert(entity);
        return toDTO(entity);
    }

    public IPage<CommentAdminDTO> listAll(int page, int size) {
        IPage<CommentAdminDTO> result = commentMapper.selectAllWithPagination(new Page<>(page, size));
        result.getRecords().forEach(dto -> {
            if (dto.getUserId() != null) {
                User user = userMapper.selectById(dto.getUserId());
                if (user != null) {
                    dto.setUserAvatarUrl(user.getAvatarUrl());
                }
            }
        });
        return result;
    }

    public void delete(Long id, String email) {
        Comment comment = commentMapper.selectById(id);
        if (comment == null) throw new ResourceNotFoundException("评论不存在");
        if (email != null) {
            User currentUser = userMapper.selectByEmail(email);
            if (currentUser == null) throw new IllegalArgumentException("用户不存在");
            if (!currentUser.getId().equals(comment.getUserId())) throw new IllegalArgumentException("无权删除此评论");
        }
        commentMapper.deleteById(id);
    }

    private User createTempUser() {
        Random random = new Random();
        String username;
        do {
            int num = 100000000 + random.nextInt(900000000);
            username = "user" + num;
        } while (userMapper.selectByUsername(username) != null);

        User tempUser = new User();
        tempUser.setUsername(username);
        tempUser.setEmail(username + "@temp.local");
        tempUser.setDisplayName(username);
        tempUser.setRole("USER");
        userMapper.insert(tempUser);
        return tempUser;
    }

    private CommentDTO toDTO(Comment c) {
        CommentDTO dto = new CommentDTO();
        dto.setId(c.getId());
        dto.setArticleId(c.getArticleId());
        dto.setParentId(c.getParentId());
        dto.setUserId(c.getUserId());
        dto.setAuthorName(c.getAuthorName());
        dto.setAuthorEmail(c.getAuthorEmail());
        dto.setContent(c.getContent());
        dto.setApproved(c.getIsApproved());
        dto.setCreatedAt(c.getCreatedAt());

        if (c.getUserId() != null) {
            User user = userMapper.selectById(c.getUserId());
            if (user != null) {
                dto.setUserAvatarUrl(user.getAvatarUrl());
            }
        }

        return dto;
    }
}
