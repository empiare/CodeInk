package com.myblog.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.myblog.config.JwtUtil;
import com.myblog.mapper.UserMapper;
import com.myblog.model.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public Map<String, Object> register(String username, String email, String password, String displayName) {
        if (userMapper.selectByUsername(username) != null) {
            throw new IllegalArgumentException("用户名已存在");
        }
        if (userMapper.selectByEmail(email) != null) {
            throw new IllegalArgumentException("邮箱已被注册");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setDisplayName(displayName != null && !displayName.isEmpty() ? displayName : username);
        user.setAvatarUrl(generateGravatarUrl(email));

        userMapper.insert(user);

        return login(email, password);
    }

    public Map<String, Object> login(String email, String password) {
        User user = userMapper.selectByEmail(email);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("邮箱或密码错误");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", buildUserInfo(user));
        return result;
    }

    public Map<String, Object> adminLogin(String email, String password) {
        User user = userMapper.selectByEmail(email);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("邮箱或密码错误");
        }
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("无权限访问管理后台");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", buildUserInfo(user));
        return result;
    }

    public Map<String, Object> googleLogin(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new IllegalArgumentException("无效的 Google ID Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String googleId = payload.getSubject();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            User user = userMapper.selectByGoogleId(googleId);

            if (user == null) {
                user = userMapper.selectByEmail(email);
                if (user != null) {
                    user.setGoogleId(googleId);
                    if (user.getAvatarUrl() == null) {
                        user.setAvatarUrl(picture);
                    }
                    userMapper.updateById(user);
                } else {
                    user = new User();
                    user.setGoogleId(googleId);
                    user.setEmail(email);
                    user.setUsername(email.split("@")[0]);
                    user.setDisplayName(name);
                    user.setAvatarUrl(picture != null ? picture : generateGravatarUrl(email));
                    userMapper.insert(user);
                }
            }

            String token = jwtUtil.generateToken(user.getEmail());
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("user", buildUserInfo(user));
            return result;

        } catch (Exception e) {
            throw new IllegalArgumentException("Google 登录失败: " + e.getMessage());
        }
    }

    public Map<String, Object> getCurrentUser(String email) {
        User user = userMapper.selectByEmail(email);
        if (user == null) throw new IllegalArgumentException("用户不存在");
        return buildUserInfo(user);
    }

    private Map<String, Object> buildUserInfo(User user) {
        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("username", user.getUsername());
        info.put("email", user.getEmail());
        info.put("displayName", user.getDisplayName());
        info.put("avatarUrl", user.getAvatarUrl());
        info.put("role", user.getRole());
        info.put("createdAt", user.getCreatedAt());
        return info;
    }

    private String generateGravatarUrl(String email) {
        try {
            String trimmedEmail = email.trim().toLowerCase();
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(trimmedEmail.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return "https://www.gravatar.com/avatar/" + hexString.toString() + "?d=identicon&s=200";
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available", e);
        }
    }
}
