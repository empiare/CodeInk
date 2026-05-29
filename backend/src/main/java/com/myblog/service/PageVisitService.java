package com.myblog.service;

import com.myblog.mapper.PageVisitMapper;
import com.myblog.model.entity.PageVisit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PageVisitService {

    @Autowired
    private PageVisitMapper pageVisitMapper;

    private final ConcurrentHashMap<String, Long> visitCache = new ConcurrentHashMap<>();
    private static final long COOLDOWN_MS = 60_000;

    public void recordVisit(String ipAddress, String pagePath) {
        long now = System.currentTimeMillis();
        Long lastVisit = visitCache.get(ipAddress);

        if (lastVisit != null && now - lastVisit < COOLDOWN_MS) {
            return;
        }

        visitCache.put(ipAddress, now);

        PageVisit visit = new PageVisit();
        visit.setIpAddress(ipAddress);
        visit.setPagePath(pagePath);
        visit.setVisitedAt(LocalDateTime.now());
        pageVisitMapper.insert(visit);
    }
}
