package com.myblog.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Component
public class BaiduTranslationProvider implements TranslationProvider {

    private static final String BAIDU_API_URL =
            "https://fanyi-api.baidu.com/api/trans/vip/translate";

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final AtomicLong lastRequestTime = new AtomicLong(0);

    @Value("${ai-news.translation.baidu.app-id:}")
    private String appId;

    @Value("${ai-news.translation.baidu.secret-key:}")
    private String secretKey;

    @PostConstruct
    public void init() {
        log.info("BaiduTranslationProvider 初始化: appId={}, secretKey={}",
                appId.isEmpty() ? "未配置" : appId.substring(0, 6) + "***",
                secretKey.isEmpty() ? "未配置" : "***已配置***");
    }

    @Override
    public String translate(String text) {
        if (appId.isEmpty() || secretKey.isEmpty()) {
            log.debug("百度翻译 API 未配置，跳过");
            return null;
        }

        String salt = String.valueOf(new Random().nextInt(100000));
        String sign = md5(appId + text + salt + secretKey);

        try {
            rateLimit();

            String url = BAIDU_API_URL
                    + "?q=" + URLEncoder.encode(text, StandardCharsets.UTF_8)
                    + "&from=auto&to=zh"
                    + "&appid=" + appId
                    + "&salt=" + salt
                    + "&sign=" + sign;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();

            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("百度翻译返回非200状态码: {}", response.statusCode());
                return null;
            }

            return parseResponse(response.body());
        } catch (Exception e) {
            log.warn("百度翻译请求失败 [{}]: {}", e.getClass().getSimpleName(), e.getMessage());
            return null;
        }
    }

    private void rateLimit() {
        long now = System.currentTimeMillis();
        long last = lastRequestTime.get();
        long minInterval = 1100;
        long waitMs = last + minInterval - now;
        if (waitMs > 0) {
            try {
                Thread.sleep(waitMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        lastRequestTime.set(System.currentTimeMillis());
    }

    private String parseResponse(String body) {
        try {
            JSONObject json = new JSONObject(body);
            if (json.has("error_code")) {
                log.warn("百度翻译返回错误: code={}, msg={}",
                        json.getString("error_code"), json.optString("error_msg"));
                return null;
            }
            JSONArray transResult = json.getJSONArray("trans_result");
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < transResult.length(); i++) {
                JSONObject item = transResult.getJSONObject(i);
                if (result.length() > 0) {
                    result.append(" ");
                }
                result.append(item.getString("dst"));
            }
            return result.length() > 0 ? result.toString() : null;
        } catch (Exception e) {
            log.warn("解析百度翻译响应失败: {}", e.getMessage());
            return null;
        }
    }

    private String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("MD5计算失败", e);
        }
    }
}
