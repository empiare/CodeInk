package com.myblog.controller;

import com.myblog.model.dto.ApiResponse;
import com.myblog.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ApiResponse<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        String displayName = body.get("displayName");
        return ApiResponse.ok(authService.register(username, email, password, displayName));
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        return ApiResponse.ok(authService.login(email, password));
    }

    @PostMapping("/google")
    public ApiResponse<Map<String, Object>> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        return ApiResponse.ok(authService.googleLogin(idToken));
    }

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(Authentication authentication) {
        return ApiResponse.ok(authService.getCurrentUser(authentication.getName()));
    }
}
