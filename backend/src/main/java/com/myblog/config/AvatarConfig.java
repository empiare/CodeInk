package com.myblog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AvatarConfig {

    @Value("${avatar.upload-dir}")
    private String uploadDir;

    @Value("${avatar.base-url}")
    private String baseUrl;

    public String getUploadDir() {
        return uploadDir;
    }

    public String getBaseUrl() {
        return baseUrl;
    }
}
