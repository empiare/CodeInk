package com.myblog.controller;

import com.myblog.model.dto.ApiResponse;
import com.myblog.service.PageVisitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/page-visit")
public class PageVisitController {

    @Autowired
    private PageVisitService pageVisitService;

    @PostMapping
    public ApiResponse<Void> recordVisit(
            @RequestParam String path,
            HttpServletRequest request) {
        String ip = getClientIp(request);
        pageVisitService.recordVisit(ip, path);
        return ApiResponse.ok();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isEmpty()) {
            ip = ip.split(",")[0].trim();
        } else {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
