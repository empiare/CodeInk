package com.myblog.service;

import com.myblog.mapper.AiNewsMapper;
import com.myblog.mapper.AiNewsSourceMapper;
import com.myblog.model.entity.AiNews;
import com.myblog.model.entity.AiNewsSource;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.safety.Safelist;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
public class AiNewsCrawlerService {

    @Autowired
    private AiNewsMapper aiNewsMapper;

    @Autowired
    private AiNewsSourceMapper aiNewsSourceMapper;

    @Autowired
    private GoogleTranslationService translationService;

    private static final String[] USER_AGENTS = {
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    };

    @Data
    public static class CrawlResult {
        private int totalSources;
        private int successSources;
        private int failedSources;
        private int newItems;
        private List<String> errors = new ArrayList<>();
    }

    /**
     * 执行一次全量抓取
     */
    public CrawlResult crawlAll() {
        CrawlResult result = new CrawlResult();
        List<AiNewsSource> sources = aiNewsSourceMapper.selectEnabledSources();
        result.setTotalSources(sources.size());

        for (AiNewsSource source : sources) {
            try {
                int newCount = crawlSource(source);
                result.setSuccessSources(result.getSuccessSources() + 1);
                result.setNewItems(result.getNewItems() + newCount);

                // 更新最后抓取时间
                source.setLastFetchedAt(LocalDateTime.now());
                aiNewsSourceMapper.updateById(source);

                log.info("成功抓取数据源 [{}]: 新增 {} 条", source.getSourceName(), newCount);

                // 请求间隔，避免反爬
                Thread.sleep(2000 + ThreadLocalRandom.current().nextInt(1000));
            } catch (Exception e) {
                result.setFailedSources(result.getFailedSources() + 1);
                result.getErrors().add(source.getSourceName() + ": " + e.getMessage());
                log.error("抓取数据源 [{}] 失败: {}", source.getSourceName(), e.getMessage());
            }
        }

        return result;
    }

    /**
     * 抓取单个数据源
     */
    public int crawlSource(AiNewsSource source) throws Exception {
        List<AiNews> newsList = fetchFeed(source);
        int newCount = 0;

        for (AiNews news : newsList) {
            try {
                AiNews existing = aiNewsMapper.selectByUrl(news.getUrl());
                if (existing == null) {
                    aiNewsMapper.insert(news);
                    newCount++;
                }
            } catch (Exception e) {
                log.warn("保存资讯失败 [{}]: {}", news.getTitle(), e.getMessage());
            }
        }

        return newCount;
    }

    /**
     * 根据Feed类型抓取
     */
    private List<AiNews> fetchFeed(AiNewsSource source) throws Exception {
        String feedType = source.getFeedType().toUpperCase();

        if ("RSS".equals(feedType) || "ATOM".equals(feedType)) {
            return fetchRssFeed(source);
        } else if ("HTML".equals(feedType)) {
            return fetchHtmlFeed(source);
        } else {
            throw new IllegalArgumentException("不支持的Feed类型: " + feedType);
        }
    }

    /**
     * 使用Rome库解析RSS/Atom
     */
    private List<AiNews> fetchRssFeed(AiNewsSource source) throws Exception {
        List<AiNews> result = new ArrayList<>();

        URL feedUrl = new URL(source.getFeedUrl());
        SyndFeedInput input = new SyndFeedInput();
        SyndFeed feed = input.build(new XmlReader(feedUrl));

        for (SyndEntry entry : feed.getEntries()) {
            try {
                AiNews news = new AiNews();
                news.setTitle(cleanText(entry.getTitle()));
                news.setUrl(entry.getLink());
                news.setSourceName(source.getSourceName());
                news.setSourceKey(source.getSourceKey());
                news.setAuthor(entry.getAuthor());
                news.setIsVisible(true);
                news.setViewCount(0);
                news.setFetchedAt(LocalDateTime.now());

                // 处理发布时间
                if (entry.getPublishedDate() != null) {
                    news.setPublishedAt(entry.getPublishedDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else if (entry.getUpdatedDate() != null) {
                    news.setPublishedAt(entry.getUpdatedDate().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDateTime());
                } else {
                    news.setPublishedAt(LocalDateTime.now());
                }

                // 处理摘要和封面图
                if (entry.getDescription() != null) {
                    String descHtml = entry.getDescription().getValue();
                    news.setSummary(extractText(descHtml, 300));
                    news.setCoverImage(extractFirstImage(descHtml));
                }

                // 翻译标题和摘要为中文
                news.setTitle(translationService.translateToChinese(news.getTitle()));
                if (news.getSummary() != null && !news.getSummary().isEmpty()) {
                    news.setSummary(translationService.translateToChinese(news.getSummary()));
                }

                result.add(news);
            } catch (Exception e) {
                log.warn("解析RSS条目失败: {}", e.getMessage());
            }
        }

        return result;
    }

    /**
     * 使用Jsoup解析HTML页面
     */
    private List<AiNews> fetchHtmlFeed(AiNewsSource source) throws Exception {
        List<AiNews> result = new ArrayList<>();

        Document doc = Jsoup.connect(source.getFeedUrl())
                .userAgent(getRandomUserAgent())
                .timeout(15000)
                .get();

        // 通用选择器配置，可根据sourceKey自定义
        String selector = getHtmlSelector(source.getSourceKey());
        Elements elements = doc.select(selector);

        for (Element element : elements) {
            try {
                AiNews news = new AiNews();
                news.setSourceName(source.getSourceName());
                news.setSourceKey(source.getSourceKey());
                news.setIsVisible(true);
                news.setViewCount(0);
                news.setFetchedAt(LocalDateTime.now());
                news.setPublishedAt(LocalDateTime.now());

                // 提取标题和链接
                Element linkElement = element.selectFirst("a");
                if (linkElement != null) {
                    news.setTitle(cleanText(linkElement.text()));
                    String href = linkElement.absUrl("href");
                    news.setUrl(href.isEmpty() ? linkElement.attr("href") : href);
                }

                // 提取摘要
                Element summaryElement = element.selectFirst("p, .summary, .desc");
                if (summaryElement != null) {
                    news.setSummary(cleanText(summaryElement.text()));
                }

                // 提取封面图
                Element imgElement = element.selectFirst("img");
                if (imgElement != null) {
                    news.setCoverImage(imgElement.absUrl("src"));
                }

                // 翻译标题和摘要为中文
                if (news.getTitle() != null && !news.getTitle().isEmpty()) {
                    news.setTitle(translationService.translateToChinese(news.getTitle()));
                }
                if (news.getSummary() != null && !news.getSummary().isEmpty()) {
                    news.setSummary(translationService.translateToChinese(news.getSummary()));
                }

                if (news.getTitle() != null && !news.getTitle().isEmpty() 
                        && news.getUrl() != null && !news.getUrl().isEmpty()) {
                    result.add(news);
                }
            } catch (Exception e) {
                log.warn("解析HTML条目失败: {}", e.getMessage());
            }
        }

        return result;
    }

    /**
     * 获取HTML解析选择器
     */
    private String getHtmlSelector(String sourceKey) {
        // 根据不同网站配置不同的CSS选择器
        switch (sourceKey) {
            case "36kr-ai":
                return "article, .article-item, .kr-flow-article-item";
            case "infoq-cn":
                return ".article-item, .news-item";
            default:
                return "article, .article, .news-item, .post-item";
        }
    }

    /**
     * 从HTML中提取纯文本
     */
    private String extractText(String html, int maxLength) {
        if (html == null || html.isEmpty()) {
            return "";
        }
        String text = Jsoup.clean(html, Safelist.none());
        text = text.replaceAll("\\s+", " ").trim();
        if (text.length() > maxLength) {
            text = text.substring(0, maxLength) + "...";
        }
        return text;
    }

    /**
     * 从HTML中提取第一张图片
     */
    private String extractFirstImage(String html) {
        if (html == null || html.isEmpty()) {
            return null;
        }
        Document doc = Jsoup.parse(html);
        Element img = doc.selectFirst("img");
        return img != null ? img.attr("src") : null;
    }

    /**
     * 清理文本
     */
    private String cleanText(String text) {
        if (text == null) {
            return "";
        }
        return text.replaceAll("<[^>]+>", "").replaceAll("\\s+", " ").trim();
    }

    /**
     * 获取随机User-Agent
     */
    private String getRandomUserAgent() {
        return USER_AGENTS[ThreadLocalRandom.current().nextInt(USER_AGENTS.length)];
    }
}
