package com.myblog.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AvatarConfig {

    @Value("${avatar.upload-dir:}")
    private String rawUploadDir;

    @Value("${avatar.base-url:}")
    private String rawBaseUrl;

    private String uploadDir;
    private String baseUrl;

    @PostConstruct
    public void init() {
        boolean isWindows = System.getProperty("os.name")
                .toLowerCase().contains("win");

        if (rawUploadDir != null && !rawUploadDir.isBlank()) {
            this.uploadDir = rawUploadDir;
        } else if (isWindows) {
            this.uploadDir = "D:\\acode\\blog\\backend\\src\\main\\resources\\avatar";
        } else {
            this.uploadDir = "/app/mylog/avatar";
        }

        if (rawBaseUrl != null && !rawBaseUrl.isBlank()) {
            this.baseUrl = rawBaseUrl;
        } else if (isWindows) {
            this.baseUrl = "http://localhost:8080/avatar";
        } else {
            this.baseUrl = "/avatar";
        }
    }

    public String getUploadDir() {
        return uploadDir;
    }

    public String getBaseUrl() {
        return baseUrl;
    }
}
