package com.myblog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.myblog.mapper.UserMapper;
import com.myblog.model.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<User> getUsers(int page, int size, String keyword) {
        Page<User> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            wrapper.like(User::getUsername, kw)
                   .or().like(User::getEmail, kw)
                   .or().like(User::getDisplayName, kw);
        }
        wrapper.orderByDesc(User::getCreatedAt);
        return userMapper.selectPage(pageParam, wrapper);
    }

    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    public void createUser(User user) {
        if (userMapper.selectByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("用户名已存在");
        }
        if (userMapper.selectByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("邮箱已被注册");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.insert(user);
    }

    public void updateUser(Long id, User updateData) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new IllegalArgumentException("用户不存在");
        }

        if (updateData.getUsername() != null) {
            User existing = userMapper.selectByUsername(updateData.getUsername());
            if (existing != null && !existing.getId().equals(id)) {
                throw new IllegalArgumentException("用户名已存在");
            }
            user.setUsername(updateData.getUsername());
        }
        if (updateData.getEmail() != null) {
            User existing = userMapper.selectByEmail(updateData.getEmail());
            if (existing != null && !existing.getId().equals(id)) {
                throw new IllegalArgumentException("邮箱已被注册");
            }
            user.setEmail(updateData.getEmail());
        }
        if (updateData.getDisplayName() != null) {
            user.setDisplayName(updateData.getDisplayName());
        }
        if (updateData.getAvatarUrl() != null) {
            user.setAvatarUrl(updateData.getAvatarUrl());
        }
        if (updateData.getPassword() != null && !updateData.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateData.getPassword()));
        }

        userMapper.updateById(user);
    }

    public void deleteUser(Long id) {
        userMapper.deleteById(id);
    }

    public User getUserByEmail(String email) {
        return userMapper.selectByEmail(email);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userMapper.selectByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("原密码错误");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("新密码长度不能少于6位");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userMapper.updateById(user);
    }
}
