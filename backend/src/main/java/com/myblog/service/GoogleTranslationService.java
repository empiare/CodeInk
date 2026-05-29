package com.myblog.service;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Google翻译服务（免费接口）
 */
@Slf4j
@Service
public class GoogleTranslationService {

    private static final String TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";

    /**
     * 将英文翻译成中文
     */
    public String translateToChinese(String text) {
        if (text == null || text.trim().isEmpty()) {
            return text;
        }

        // 如果已经是中文，直接返回
        if (isChinese(text)) {
            return text;
        }

        try {
            String url = TRANSLATE_URL +
                    "?client=gtx" +
                    "&sl=en" +
                    "&tl=zh-CN" +
                    "&dt=t" +
                    "&q=" + URLEncoder.encode(text, StandardCharsets.UTF_8);

            String response = Jsoup.connect(url)
                    .ignoreContentType(true)
                    .timeout(10000)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .execute()
                    .body();

            return parseTranslationResponse(response);
        } catch (Exception e) {
            log.warn("翻译失败，返回原文: {}", e.getMessage());
            return text;
        }
    }

    /**
     * 批量翻译
     */
    public void translateAiNewsFields(String[] titles, String[] summaries) {
        // 可以实现批量翻译优化
    }

    /**
     * 解析Google翻译响应
     */
    private String parseTranslationResponse(String response) {
        try {
            JSONArray json = new JSONArray(response);
            JSONArray sentences = json.getJSONArray(0);

            StringBuilder result = new StringBuilder();
            for (int i = 0; i < sentences.length(); i++) {
                JSONArray sentence = sentences.getJSONArray(i);
                if (!sentence.isNull(0)) {
                    result.append(sentence.getString(0));
                }
            }

            return result.toString();
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
