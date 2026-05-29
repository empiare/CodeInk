package com.myblog.service;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 翻译服务（使用有道翻译免费接口）
 */
@Slf4j
@Service
public class GoogleTranslationService {

    // 有道翻译免费接口
    private static final String YOUDAO_URL = "https://fanyi.youdao.com/translate?&doctype=json&type=AUTO2ZH_CN";

    @Value("${ai-news.translation.enabled:true}")
    private boolean translationEnabled;

    /**
     * 将英文翻译成中文
     */
    public String translateToChinese(String text) {
        if (text == null || text.trim().isEmpty()) {
            return text;
        }

        // 如果翻译功能未启用，直接返回原文
        if (!translationEnabled) {
            return text;
        }

        // 如果已经是中文，直接返回
        if (isChinese(text)) {
            return text;
        }

        // 截断过长的文本
        if (text.length() > 500) {
            text = text.substring(0, 500);
        }

        try {
            String url = YOUDAO_URL + "&i=" + URLEncoder.encode(text, StandardCharsets.UTF_8);

            String response = Jsoup.connect(url)
                    .ignoreContentType(true)
                    .timeout(15000)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .execute()
                    .body();

            return parseYoudaoResponse(response);
        } catch (Exception e) {
            log.warn("翻译失败，返回原文: {}", e.getMessage());
            return text;
        }
    }

    /**
     * 解析有道翻译响应
     */
    private String parseYoudaoResponse(String response) {
        try {
            // 响应格式: {"type":"AUTO2ZH_CN","errorCode":0,"elapsedTime":1,"translateResult":[[{"src":"hello","tgt":"你好"}]]}
            Pattern pattern = Pattern.compile("\"tgt\":\"([^\"]+)\"");
            Matcher matcher = pattern.matcher(response);

            StringBuilder result = new StringBuilder();
            while (matcher.find()) {
                if (result.length() > 0) {
                    result.append(" ");
                }
                result.append(matcher.group(1));
            }

            return result.length() > 0 ? result.toString() : null;
        } catch (Exception e) {
            log.warn("解析翻译响应失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 判断文本是否主要是中文
     */
    private boolean isChinese(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }

        int chineseCount = 0;
        for (char c : text.toCharArray()) {
            if (Character.UnicodeScript.of(c) == Character.UnicodeScript.HAN) {
                chineseCount++;
            }
        }

        // 如果中文字符超过30%，认为是中文
        return (double) chineseCount / text.length() > 0.3;
    }
}
