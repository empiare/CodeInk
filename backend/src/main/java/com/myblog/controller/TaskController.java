package com.myblog.controller;

import com.myblog.model.dto.ApiResponse;
import com.myblog.model.dto.TaskInfoDTO;
import com.myblog.service.TaskManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/tasks")
public class TaskController {

    @Autowired
    private TaskManagerService taskManagerService;

    @GetMapping
    public ApiResponse<List<TaskInfoDTO>> listTasks() {
        return ApiResponse.ok(taskManagerService.listTasks());
    }

    @PostMapping("/{name}/pause")
    public ApiResponse<Void> pauseTask(@PathVariable String name) {
        try {
            taskManagerService.pauseTask(name);
            return ApiResponse.ok();
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/{name}/resume")
    public ApiResponse<Void> resumeTask(@PathVariable String name) {
        try {
            taskManagerService.resumeTask(name);
            return ApiResponse.ok();
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/{name}/trigger")
    public ApiResponse<Void> triggerTask(@PathVariable String name) {
        try {
            taskManagerService.triggerNow(name);
            return ApiResponse.ok();
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{name}/cron")
    public ApiResponse<Void> updateCron(@PathVariable String name, @RequestBody Map<String, String> body) {
        try {
            String cronExpression = body.get("cronExpression");
            if (cronExpression == null || cronExpression.isBlank()) {
                return ApiResponse.error("cronExpression 不能为空");
            }
            taskManagerService.updateCron(name, cronExpression);
            return ApiResponse.ok();
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
