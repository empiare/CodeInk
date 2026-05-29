package com.myblog.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TaskInfoDTO {
    private String name;
    private String cronExpression;
    private String description;
    private String status;
    private LocalDateTime lastExecutionTime;
    private LocalDateTime nextExecutionTime;
    private String lastResult;
    private List<ExecutionRecord> executionHistory;

    @Data
    @AllArgsConstructor
    public static class ExecutionRecord {
        private LocalDateTime time;
        private String result;
        private String message;
    }
}
