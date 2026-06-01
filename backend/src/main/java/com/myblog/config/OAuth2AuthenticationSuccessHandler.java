package com.myblog.config;

import com.myblog.mapper.UserMapper;
import com.myblog.model.entity.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserMapper userMapper;

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/auth/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        User user = userMapper.selectByEmail(email);
        if (user == null) {
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        String redirectUrl = redirectUri + "?token=" + token +
                "&user=" + java.net.URLEncoder.encode(user.getDisplayName(), "UTF-8") +
                "&avatar=" + java.net.URLEncoder.encode(user.getAvatarUrl() != null ? user.getAvatarUrl() : "", "UTF-8");

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
