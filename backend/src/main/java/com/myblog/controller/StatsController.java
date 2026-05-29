package com.myblog.controller;

import com.myblog.model.dto.ApiResponse;
import com.myblog.model.dto.StatsDTO;
import com.myblog.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
