package com.myblog.task;

import com.myblog.service.AiNewsCrawlerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * AI新闻爬取任务（保留用于手动调用场景）
 * 定时调度已迁移至 TaskManagerService 统一管理
 */
@Slf4j
@Component
public class AiNewsCrawlerTask {

    @Autowired
    private AiNewsCrawlerService crawlerService;

    public void crawlAiNews() {
        log.info("===== AI资讯定时抓取开始 =====");
        try {
            AiNewsCrawlerService.CrawlResult result = crawlerService.crawlAll();
            log.info("抓取完成: 总源数={}, 成功={}, 失败={}, 新增={}",
                    result.getTotalSources(),
                    result.getSuccessSources(),
                    result.getFailedSources(),
                    result.getNewItems());

            if (!result.getErrors().isEmpty()) {
                log.warn("抓取错误: {}", result.getErrors());
            }
        } catch (Exception e) {
            log.error("AI资讯定时抓取异常", e);
        }
        log.info("===== AI资讯定时抓取结束 =====");
    }
}
