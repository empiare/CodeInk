package com.myblog.task;

import com.myblog.service.AiNewsCrawlerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AiNewsCrawlerTask {

    @Autowired
    private AiNewsCrawlerService crawlerService;

    /**
     * 每30分钟执行一次全量抓取
     * cron表达式: 秒 分 时 日 月 周
     */
    @Scheduled(cron = "0 */30 * * * ?")
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
