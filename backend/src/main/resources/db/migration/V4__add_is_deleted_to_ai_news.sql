ALTER TABLE ai_news ADD COLUMN is_deleted TINYINT DEFAULT 0 COMMENT '是否删除 0未删除 1已删除' AFTER is_visible;
