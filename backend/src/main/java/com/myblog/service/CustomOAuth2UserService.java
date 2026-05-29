package com.myblog.service;

import com.myblog.mapper.UserMapper;
import com.myblog.model.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String googleId = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

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

        return oauth2User;
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
