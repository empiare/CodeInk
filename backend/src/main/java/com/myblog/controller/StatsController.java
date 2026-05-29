package com.myblog.controller;

import com.myblog.model.dto.ApiResponse;
import com.myblog.model.dto.StatsDTO;
import com.myblog.model.dto.TimeStatsDTO;
import com.myblog.model.dto.TrendStatsDTO;
import com.myblog.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping
    public ApiResponse<StatsDTO> getStats() {
        return ApiResponse.ok(statsService.getStats());
    }

    @GetMapping("/period")
    public ApiResponse<TimeStatsDTO> getTimeStats(
            @RequestParam(defaultValue = "24h") String period) {
        return ApiResponse.ok(statsService.getTimeStats(period));
    }

    @GetMapping("/trend")
    public ApiResponse<TrendStatsDTO> getTrendStats(
            @RequestParam(defaultValue = "24h") String range) {
        return ApiResponse.ok(statsService.getTrendStats(range));
    }
}
