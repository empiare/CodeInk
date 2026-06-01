package com.myblog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.myblog.model.dto.ApiResponse;
import com.myblog.model.entity.User;
import com.myblog.config.JwtUtil;
import com.myblog.service.AvatarService;
import com.myblog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AvatarService avatarService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ApiResponse<User> getProfile(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.validateAndGetUsername(token.replace("Bearer ", ""));
        User user = userService.getUserByEmail(email);
        user.setPassword(null);
        return ApiResponse.ok(user);
    }

    @PutMapping("/profile")
    public ApiResponse<Void> updateProfile(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> updates) {
        String email = jwtUtil.validateAndGetUsername(token.replace("Bearer ", ""));
        User user = userService.getUserByEmail(email);
        if (updates.containsKey("displayName")) {
            user.setDisplayName(updates.get("displayName"));
        }
        if (updates.containsKey("username")) {
            user.setUsername(updates.get("username"));
        }
        if (updates.containsKey("avatarUrl")) {
            user.setAvatarUrl(updates.get("avatarUrl"));
        }
        userService.updateUser(user.getId(), user);
        return ApiResponse.ok(null);
    }

    @PostMapping("/profile/password")
    public ApiResponse<Void> changePassword(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> body) {
        String email = jwtUtil.validateAndGetUsername(token.replace("Bearer ", ""));
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        userService.changePassword(email, oldPassword, newPassword);
        return ApiResponse.ok(null);
    }

    @PostMapping("/profile/avatar")
    public ApiResponse<Map<String, Object>> uploadAvatar(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) {
        String email = jwtUtil.validateAndGetUsername(token.replace("Bearer ", ""));
        User user = userService.getUserByEmail(email);
        try {
            if (user.getAvatarUrl() != null) {
                avatarService.deleteAvatar(user.getAvatarUrl());
            }
            String avatarUrl = avatarService.uploadAvatar(file, user.getId());
            return ApiResponse.ok(Map.of("avatarUrl", avatarUrl));
        } catch (Exception e) {
            return ApiResponse.error("头像上传失败: " + e.getMessage());
        }
    }

    @GetMapping("/admin/users")
    public ApiResponse<Page<User>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(userService.getUsers(page, size, keyword));
    }

    @GetMapping("/admin/users/{id}")
    public ApiResponse<User> getUser(@PathVariable Long id) {
        return ApiResponse.ok(userService.getUserById(id));
    }

    @PostMapping("/admin/users")
    public ApiResponse<Void> createUser(@RequestBody User user) {
        userService.createUser(user);
        return ApiResponse.ok(null);
    }

    @PutMapping("/admin/users/{id}")
    public ApiResponse<Void> updateUser(@PathVariable Long id, @RequestBody User user) {
        userService.updateUser(id, user);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/admin/users/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.ok(null);
    }

    @PutMapping("/admin/users/{id}/role")
    public ApiResponse<Void> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        userService.updateUserRole(id, body.get("role"));
        return ApiResponse.ok(null);
    }
}
