package com.myblog.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("task_execution_history")
public class TaskExecutionHistory {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String taskName;
    private String result;
    private String message;
    private LocalDateTime executedAt;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
