package com.myblog.service;

import com.myblog.mapper.AiNewsMapper;
import com.myblog.mapper.TaskExecutionHistoryMapper;
import com.myblog.model.dto.TaskInfoDTO;
import com.myblog.model.entity.AiNews;
import com.myblog.model.entity.TaskExecutionHistory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskManagerService {

    @Autowired
    private ThreadPoolTaskScheduler scheduler;

    @Autowired
    private AiNewsCrawlerService crawlerService;

    @Autowired
    private GoogleTranslationService translationService;

    @Autowired
    private AiNewsMapper aiNewsMapper;

    @Autowired
    private TaskExecutionHistoryMapper historyMapper;

    private final ConcurrentHashMap<String, ScheduledFuture<?>> futures = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, TaskMeta> taskMetaMap = new ConcurrentHashMap<>();

    static class TaskMeta {
        String cronExpression;
        String description;
        volatile boolean running;
        AtomicReference<LocalDateTime> lastExecutionTime = new AtomicReference<>(null);
        AtomicReference<String> lastResult = new AtomicReference<>(null);

        TaskMeta(String cronExpression, String description) {
            this.cronExpression = cronExpression;
            this.description = description;
            this.running = false;
        }
    }

    @PostConstruct
    public void init() {
        register("aiNewsCrawler", "0 */30 * * * ?",
                "定时抓取AI资讯（每30分钟）",
                () -> {
                    log.info("===== AI资讯定时抓取开始 =====");
                    AiNewsCrawlerService.CrawlResult result = crawlerService.crawlAll();
                    log.info("抓取完成: 总源数={}, 成功={}, 失败={}, 新增={}",
                            result.getTotalSources(),
                            result.getSuccessSources(),
                            result.getFailedSources(),
                            result.getNewItems());
                    if (!result.getErrors().isEmpty()) {
                        log.warn("抓取错误: {}", result.getErrors());
                    }
                    log.info("===== AI资讯定时抓取结束 =====");
                });
        register("aiNewsTranslator", "0 */30 * * * ?",
                "定时翻译英文标题（每30分钟）",
                this::executeTranslationTask);
        log.info("定时任务管理器初始化完成，已注册 {} 个任务", taskMetaMap.size());
    }

    private void register(String name, String cron, String description, Runnable runnable) {
        TaskMeta meta = new TaskMeta(cron, description);
        taskMetaMap.put(name, meta);
        scheduleTask(name, cron, runnable);
        log.info("注册定时任务: name={}, cron={}", name, cron);
    }

    private void scheduleTask(String name, String cron, Runnable runnable) {
        CronTrigger trigger = new CronTrigger(cron);
        Runnable wrapped = () -> {
            TaskMeta meta = taskMetaMap.get(name);
            if (meta == null) return;
            try {
                meta.lastExecutionTime.set(LocalDateTime.now());
                runnable.run();
                meta.lastResult.set("SUCCESS");
                recordResult(name, true, "执行成功");
            } catch (Exception e) {
                meta.lastResult.set("FAILURE");
                recordResult(name, false, "执行失败: " + e.getMessage());
                log.error("定时任务执行异常: name={}", name, e);
            }
        };
        ScheduledFuture<?> future = scheduler.schedule(wrapped, trigger);
        futures.put(name, future);
        TaskMeta meta = taskMetaMap.get(name);
        if (meta != null) {
            meta.running = true;
        }
    }

    public List<TaskInfoDTO> listTasks() {
        List<TaskInfoDTO> result = new ArrayList<>();
        for (Map.Entry<String, TaskMeta> entry : taskMetaMap.entrySet()) {
            String name = entry.getKey();
            TaskMeta meta = entry.getValue();
            TaskInfoDTO dto = new TaskInfoDTO();
            dto.setName(name);
            dto.setCronExpression(meta.cronExpression);
            dto.setDescription(meta.description);
            dto.setStatus(meta.running ? "RUNNING" : "PAUSED");
            dto.setLastExecutionTime(meta.lastExecutionTime.get());
            dto.setLastResult(meta.lastResult.get());

            // 计算下次执行时间
            if (meta.running) {
                try {
                    CronExpression cronExpr = CronExpression.parse(meta.cronExpression);
                    dto.setNextExecutionTime(cronExpr.next(LocalDateTime.now()));
                } catch (Exception e) {
                    dto.setNextExecutionTime(null);
                }
            } else {
                dto.setNextExecutionTime(null);
            }

            // 从数据库查询执行历史
            List<TaskExecutionHistory> entities = historyMapper.selectRecentByTaskName(name, 20);
            List<TaskInfoDTO.ExecutionRecord> history = entities.stream()
                    .map(e -> new TaskInfoDTO.ExecutionRecord(e.getExecutedAt(), e.getResult(), e.getMessage()))
                    .collect(Collectors.toList());
            dto.setExecutionHistory(history);
            result.add(dto);
        }
        return result;
    }

    public void pauseTask(String name) {
        if (!taskMetaMap.containsKey(name)) {
            throw new IllegalArgumentException("任务不存在: " + name);
        }
        ScheduledFuture<?> future = futures.remove(name);
        if (future != null) {
            future.cancel(false);
        }
        TaskMeta meta = taskMetaMap.get(name);
        if (meta != null) {
            meta.running = false;
        }
        log.info("暂停定时任务: name={}", name);
    }

    public void resumeTask(String name) {
        TaskMeta meta = taskMetaMap.get(name);
        if (meta == null) {
            throw new IllegalArgumentException("任务不存在: " + name);
        }
        if (meta.running) {
            return; // 已在运行
        }
        Runnable runnable = getRunnable(name);
        if (runnable == null) {
            throw new IllegalArgumentException("无法找到任务对应的执行逻辑: " + name);
        }
        scheduleTask(name, meta.cronExpression, runnable);
        log.info("恢复定时任务: name={}, cron={}", name, meta.cronExpression);
    }

    public void triggerNow(String name) {
        TaskMeta meta = taskMetaMap.get(name);
        if (meta == null) {
            throw new IllegalArgumentException("任务不存在: " + name);
        }
        Runnable runnable = getRunnable(name);
        if (runnable == null) {
            throw new IllegalArgumentException("无法找到任务对应的执行逻辑: " + name);
        }
        CompletableFuture.runAsync(() -> {
            try {
                meta.lastExecutionTime.set(LocalDateTime.now());
                runnable.run();
                meta.lastResult.set("SUCCESS");
                recordResult(name, true, "手动触发执行成功");
                log.info("手动触发任务执行成功: name={}", name);
            } catch (Exception e) {
                meta.lastResult.set("FAILURE");
                recordResult(name, false, "手动触发执行失败: " + e.getMessage());
                log.error("手动触发任务执行异常: name={}", name, e);
            }
        });
        log.info("手动触发任务执行: name={}", name);
    }

    public void updateCron(String name, String newCron) {
        TaskMeta meta = taskMetaMap.get(name);
        if (meta == null) {
            throw new IllegalArgumentException("任务不存在: " + name);
        }
        // 校验 cron 表达式
        try {
            CronExpression.parse(newCron);
        } catch (Exception e) {
            throw new IllegalArgumentException("无效的 cron 表达式: " + newCron, e);
        }

        meta.cronExpression = newCron;

        // 如果正在运行，重新调度
        if (meta.running) {
            ScheduledFuture<?> future = futures.remove(name);
            if (future != null) {
                future.cancel(false);
            }
            Runnable runnable = getRunnable(name);
            if (runnable != null) {
                scheduleTask(name, newCron, runnable);
            }
        }
        log.info("更新定时任务 cron: name={}, newCron={}", name, newCron);
    }

    private Runnable getRunnable(String name) {
        if ("aiNewsCrawler".equals(name)) {
            return () -> {
                log.info("===== AI资讯定时抓取开始 =====");
                AiNewsCrawlerService.CrawlResult result = crawlerService.crawlAll();
                log.info("抓取完成: 总源数={}, 成功={}, 失败={}, 新增={}",
                        result.getTotalSources(),
                        result.getSuccessSources(),
                        result.getFailedSources(),
                        result.getNewItems());
                if (!result.getErrors().isEmpty()) {
                    log.warn("抓取错误: {}", result.getErrors());
                }
                log.info("===== AI资讯定时抓取结束 =====");
            };
        }
        if ("aiNewsTranslator".equals(name)) {
            return this::executeTranslationTask;
        }
        return null;
    }

    private void executeTranslationTask() {
        log.info("===== 英文标题翻译任务开始 =====");
        List<AiNews> newsList = aiNewsMapper.selectVisibleForTranslation();
        int translatedCount = 0;

        for (AiNews news : newsList) {
            if (news.getTitle() != null && !translationService.isChinese(news.getTitle())) {
                String translatedTitle = translationService.translateToChinese(news.getTitle());
                if (translatedTitle != null && !translatedTitle.equals(news.getTitle())) {
                    AiNews update = new AiNews();
                    update.setId(news.getId());
                    update.setTitle(translatedTitle);
                    aiNewsMapper.updateById(update);
                    translatedCount++;
                    log.info("翻译标题: id={}, 原文={}, 译文={}", news.getId(), news.getTitle(), translatedTitle);
                }
            }
        }

        log.info("翻译完成: 扫描={}, 翻译={}", newsList.size(), translatedCount);
        log.info("===== 英文标题翻译任务结束 =====");
    }

    private void recordResult(String name, boolean success, String message) {
        TaskExecutionHistory record = new TaskExecutionHistory();
        record.setTaskName(name);
        record.setResult(success ? "SUCCESS" : "FAILURE");
        record.setMessage(message);
        record.setExecutedAt(LocalDateTime.now());
        historyMapper.insert(record);
    }
}
