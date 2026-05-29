CREATE TABLE IF NOT EXISTS task_execution_history (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_name    VARCHAR(100)   NOT NULL COMMENT '任务名称',
    result       VARCHAR(20)    NOT NULL COMMENT 'SUCCESS/FAILURE',
    message      VARCHAR(500)   COMMENT '执行消息',
    executed_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '执行时间',
    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_task_name (task_name),
    INDEX idx_executed_at (executed_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
