package com.myblog.service;

import com.myblog.config.AvatarConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class AvatarService {

    @Autowired
    private AvatarConfig avatarConfig;

    public String uploadAvatar(MultipartFile file, Long userId) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = "avatar_" + userId + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

        Path uploadDir = Paths.get(avatarConfig.getUploadDir());
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        Path filePath = uploadDir.resolve(filename);
        file.transferTo(filePath.toFile());

        return avatarConfig.getBaseUrl() + "/" + filename;
    }

    public void deleteAvatar(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            return;
        }
        if (!avatarUrl.startsWith(avatarConfig.getBaseUrl())) {
            return;
        }
        try {
            String filename = avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1);
            if (filename.contains("?")) {
                filename = filename.substring(0, filename.indexOf("?"));
            }
            Path filePath = Paths.get(avatarConfig.getUploadDir()).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            // Ignore delete errors
        }
    }
}
