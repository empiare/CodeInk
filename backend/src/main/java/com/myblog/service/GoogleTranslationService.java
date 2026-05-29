package com.myblog.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class GoogleTranslationService {

    @Autowired
    private GoogleTranslationProvider googleProvider;

    @Autowired
    private BaiduTranslationProvider baiduProvider;

    @Value("${ai-news.translation.enabled:true}")
    private boolean translationEnabled;

    @Value("${ai-news.translation.primary:baidu}")
    private String primaryProvider;

    @PostConstruct
    public void init() {
        log.info("翻译服务初始化: enabled={}, primary={}", translationEnabled, primaryProvider);
    }

    public String translateToChinese(String text) {
        if (text == null || text.trim().isEmpty()) {
            return text;
        }

        if (!translationEnabled) {
            return text;
        }

        if (isChinese(text)) {
            return text;
        }

        if (text.length() > 500) {
            text = text.substring(0, 500);
        }

        TranslationProvider first, second;
        if ("google".equalsIgnoreCase(primaryProvider)) {
            first = googleProvider;
            second = baiduProvider;
        } else {
            first = baiduProvider;
            second = googleProvider;
        }

        String preview = text.length() > 40 ? text.substring(0, 40) + "..." : text;

        String result = first.translate(text);
        if (result != null) {
            log.info("翻译成功 [{}]: {} -> {}", first.getClass().getSimpleName(), preview, result);
            return result;
        }

        log.info("主后端 [{}] 翻译失败，尝试 fallback: {}", first.getClass().getSimpleName(), preview);
        result = second.translate(text);
        if (result != null) {
            log.info("Fallback 翻译成功 [{}]: {} -> {}", second.getClass().getSimpleName(), preview, result);
            return result;
        }

        log.warn("所有翻译后端均不可用，返回原文: {}", preview);
        return text;
    }

    public boolean isChinese(String text) {
        int chineseCount = 0;
        for (char c : text.toCharArray()) {
            if (Character.UnicodeScript.of(c) == Character.UnicodeScript.HAN) {
                chineseCount++;
            }
        }
        return (double) chineseCount / text.length() > 0.3;
    }
}
