package com.myblog.service;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Slf4j
@Component
public class GoogleTranslationProvider implements TranslationProvider {

    private static final String GOOGLE_TRANSLATE_URL =
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t";

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Override
    public String translate(String text) {
        try {
            String url = GOOGLE_TRANSLATE_URL + "&q=" + URLEncoder.encode(text, StandardCharsets.UTF_8);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(15))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .GET()
                    .build();

            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Google翻译返回非200状态码: {}", response.statusCode());
                return null;
            }

            return parseResponse(response.body());
        } catch (Exception e) {
            log.debug("Google翻译不可用 [{}]: {}", e.getClass().getSimpleName(), e.getMessage());
            return null;
        }
    }

    private String parseResponse(String body) {
        try {
            JSONArray root = new JSONArray(body);
            JSONArray segments = root.getJSONArray(0);
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < segments.length(); i++) {
                JSONArray segment = segments.getJSONArray(i);
                if (result.length() > 0) {
                    result.append(" ");
                }
                result.append(segment.getString(0));
            }
            return result.length() > 0 ? result.toString() : null;
        } catch (Exception e) {
            log.warn("解析Google翻译响应失败: {}", e.getMessage());
            return null;
        }
    }
}
