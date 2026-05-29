CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    google_id VARCHAR(100) UNIQUE,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(300),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(70) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    summary VARCHAR(500),
    cover_image VARCHAR(500),
    category_id BIGINT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS article_tags (
    article_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    parent_id BIGINT,
    user_id BIGINT,
    author_name VARCHAR(50) NOT NULL,
    author_email VARCHAR(100),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ai_news (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(300)   NOT NULL,
    url          VARCHAR(500)   NOT NULL COMMENT '原文链接',
    summary      TEXT           COMMENT '摘要/描述',
    content      LONGTEXT       COMMENT '正文内容（可选）',
    cover_image  VARCHAR(500)   COMMENT '封面图/缩略图',
    source_name  VARCHAR(100)   NOT NULL COMMENT '来源名称',
    source_key   VARCHAR(50)    NOT NULL COMMENT '来源标识',
    author       VARCHAR(100)   COMMENT '原作者',
    published_at DATETIME       COMMENT '原文发布时间',
    fetched_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '爬取时间',
    is_visible   BOOLEAN        DEFAULT TRUE COMMENT '是否在前端展示',
    view_count   INT            DEFAULT 0,
    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_url (url),
    INDEX idx_published_at (published_at DESC),
    INDEX idx_is_visible (is_visible, published_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_news_source (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_key           VARCHAR(50)    NOT NULL UNIQUE COMMENT '唯一标识',
    source_name          VARCHAR(100)   NOT NULL COMMENT '展示名称',
    feed_url             VARCHAR(500)   NOT NULL COMMENT 'RSS Feed URL',
    feed_type            VARCHAR(20)    NOT NULL DEFAULT 'RSS' COMMENT 'RSS|ATOM|HTML',
    enabled              BOOLEAN        DEFAULT TRUE COMMENT '是否启用',
    last_fetched_at      DATETIME       COMMENT '上次成功抓取时间',
    sort_order           INT            DEFAULT 0,
    created_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
