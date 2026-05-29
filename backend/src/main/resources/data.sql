-- Users (password: 990823Zl., BCrypt hashed)
INSERT INTO users (username, email, password, display_name, role) VALUES
('zengla823', 'zengla823@gmail.com', '$2b$10$kEALDdsPAZheWO7HJXn63ehCqSKjzwn7jLV5/RXs6X6JiYZTTQ3V6', '管理员', 'ADMIN'),
('861475790', '861475790@qq.com', '$2b$10$kEALDdsPAZheWO7HJXn63ehCqSKjzwn7jLV5/RXs6X6JiYZTTQ3V6', '普通用户', 'USER')
ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role);

-- Categories
INSERT IGNORE INTO categories (name, slug, description, sort_order) VALUES
('技术笔记', 'tech-notes', '编程和技术相关的笔记', 1),
('项目实战', 'projects', '项目开发过程中的记录', 2),
('随笔', 'essays', '日常思考和随想', 3),
('读书笔记', 'reading-notes', '阅读技术书籍的笔记和感悟', 4),
('工具推荐', 'tools', '好用的开发工具和效率工具', 5);

-- Tags
INSERT IGNORE INTO tags (name, slug) VALUES
('Java', 'java'),
('Spring Boot', 'spring-boot'),
('React', 'react'),
('JavaScript', 'javascript'),
('数据库', 'database'),
('前端', 'frontend'),
('后端', 'backend'),
('TypeScript', 'typescript'),
('Docker', 'docker'),
('Git', 'git'),
('性能优化', 'performance'),
('架构设计', 'architecture');

-- Sample articles
INSERT IGNORE INTO articles (title, slug, content, summary, category_id, is_published, is_featured, view_count, published_at) VALUES
('你好，欢迎来到我的博客', 'hello-world',
'## 开篇

这是我的第一篇博客文章。搭建这个博客的目的是为了记录自己在技术学习和项目实践中的思考与总结。

## 关于我

我是一名开发者，喜欢探索新技术，也喜欢用文字整理自己的想法。

## 博客技术栈

- 前端：React 18 + Vite
- 后端：Spring Boot 3.x + MyBatis-Plus
- 数据库：MySQL

希望这里能成为我持续输出的地方。',
'这是我的第一篇博客文章，记录搭建博客的初衷和技术选型。',
1, true, true, 42, '2024-01-15 10:00:00'),

('Spring Boot 入门指南', 'spring-boot-intro',
'## 什么是 Spring Boot

Spring Boot 是 Spring 框架的快速开发脚手架，它通过约定大于配置的理念，让开发者能够快速搭建独立运行的 Spring 应用。

## 核心特性

- 自动配置（Auto Configuration）
- 起步依赖（Starter Dependencies）
- 内嵌服务器（Tomcat/Jetty）
- 生产就绪特性（Actuator）

## 快速开始

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

## 配置文件

Spring Boot 支持 `application.yml` 和 `application.properties` 两种格式，推荐使用 YAML 格式。',
'Spring Boot 框架入门介绍，涵盖核心特性和快速上手方法。',
1, true, false, 128, '2024-01-20 14:30:00'),

('React Hooks 最佳实践', 'react-hooks-best-practices',
'## 为什么使用 Hooks

React Hooks 让函数组件拥有了状态管理能力，告别了 class 组件的繁琐写法。

## useState 使用技巧

```javascript
// 错误示例
const [count, setCount] = useState(0);
setCount(count + 1); // 可能导致闭包问题

// 正确示例
setCount(prev => prev + 1); // 使用函数式更新
```

## useEffect 注意事项

1. 清理副作用
2. 依赖数组的正确使用
3. 避免不必要的重新渲染

## 自定义 Hooks

将复杂逻辑抽取为自定义 Hooks，提高代码复用性：

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```',
'深入探讨 React Hooks 的使用技巧和常见陷阱，帮助你写出更优雅的 React 代码。',
1, true, true, 256, '2024-02-05 09:15:00'),

('使用 Docker 部署 Spring Boot 应用', 'docker-spring-boot',
'## 为什么要使用 Docker

Docker 提供了一致的运行环境，解决了"在我机器上能运行"的问题。

## 编写 Dockerfile

```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Docker Compose 编排

```yaml
version: ''3.8''
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/mydb
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=mydb
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 生产环境建议

- 使用多阶段构建减小镜像体积
- 配置健康检查
- 使用 Docker Secrets 管理敏感信息',
'手把手教你使用 Docker 容器化部署 Spring Boot 应用，实现一键部署。',
2, true, false, 189, '2024-02-15 16:45:00'),

('TypeScript 类型体操入门', 'typescript-type-gymnastics',
'## 什么是类型体操

TypeScript 的类型系统是图灵完备的，这意味着我们可以在类型层面进行复杂的计算。

## 条件类型

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

## 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

## 递归类型

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};
```

## 实际应用场景

- API 响应类型推导
- 表单验证类型安全
- 状态管理类型约束',
'探索 TypeScript 类型系统的强大能力，从基础类型操作到复杂类型推导。',
1, true, false, 167, '2024-03-01 11:20:00'),

('MySQL 索引优化实战', 'mysql-index-optimization',
'## 索引的本质

索引是一种数据结构，用于快速查找数据。MySQL 中最常用的是 B+ 树索引。

## 索引类型

1. 主键索引
2. 唯一索引
3. 普通索引
4. 联合索引
5. 全文索引

## 联合索引的最左前缀原则

```sql
-- 创建联合索引
CREATE INDEX idx_name_age ON users(name, age);

-- 可以使用索引的查询
SELECT * FROM users WHERE name = ''John'';
SELECT * FROM users WHERE name = ''John'' AND age = 25;

-- 无法使用索引的查询
SELECT * FROM users WHERE age = 25;
```

## EXPLAIN 分析

```sql
EXPLAIN SELECT * FROM articles WHERE category_id = 1;
```

关注字段：type, key, rows, Extra

## 优化建议

- 避免在索引列上使用函数
- 使用覆盖索引减少回表
- 控制索引数量，避免过度索引',
'通过实际案例讲解 MySQL 索引的原理和优化技巧，提升查询性能。',
1, true, true, 312, '2024-03-10 08:30:00'),

('个人博客系统开发记录（一）：架构设计', 'blog-system-architecture',
'## 项目背景

为了记录技术学习笔记和项目经验，决定从零搭建一个个人博客系统。

## 技术选型

### 前端
- React 18：组件化开发
- Vite：快速构建工具
- React Router：路由管理
- Axios：HTTP 请求

### 后端
- Spring Boot 3.x：快速开发框架
- MyBatis-Plus：简化数据库操作
- MySQL：关系型数据库
- JWT：身份认证

## 数据库设计

```sql
-- 文章表
CREATE TABLE articles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  content LONGTEXT,
  summary VARCHAR(500),
  category_id BIGINT,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API 设计原则

- RESTful 风格
- 统一响应格式
- 合理的错误处理',
'记录个人博客系统从零开始的架构设计过程，包括技术选型和数据库设计。',
2, true, false, 95, '2024-03-20 15:00:00'),

('Git 工作流最佳实践', 'git-workflow-best-practices',
'## 为什么需要 Git 工作流

良好的 Git 工作流可以提高团队协作效率，减少代码冲突。

## Git Flow

适合有明确发布周期的项目：

- main：生产环境代码
- develop：开发分支
- feature/*：功能分支
- release/*：发布分支
- hotfix/*：热修复分支

## GitHub Flow

适合持续部署的项目：

1. 从 main 创建分支
2. 提交更改
3. 创建 Pull Request
4. 代码审查
5. 合并到 main

## Trunk Based Development

适合高频发布的项目：

- 所有人直接向 main 提交
- 使用 Feature Flags 控制功能发布
- 强调持续集成

## 选择建议

- 小团队 + 持续部署：GitHub Flow
- 大团队 + 定期发布：Git Flow
- 高频发布 + Feature Flags：Trunk Based',
'介绍几种常见的 Git 工作流，帮助团队选择合适的协作方式。',
5, true, false, 143, '2024-04-02 10:15:00'),

('程序员的思考：技术深度 vs 广度', 'tech-depth-vs-breadth',
'## 引言

在程序员的职业发展中，经常会面临一个选择：是深入钻研某一领域，还是广泛涉猎各种技术？

## 深度优先

优点：
- 成为领域专家
- 更容易建立技术壁垒
- 在特定问题上有更强的解决能力

缺点：
- 可能错过其他领域的机会
- 技术栈过窄可能面临风险

## 广度优先

优点：
- 视野更开阔
- 更容易适应技术变化
- 能够整合不同领域的知识

缺点：
- 可能样样通样样松
- 难以建立核心竞争力

## 我的选择：T 型人才

先在一个领域深入，建立扎实的基础，然后逐步扩展到相关领域。

## 实践建议

1. 前 3-5 年：专注于一个方向
2. 5 年后：开始横向扩展
3. 持续学习：保持对新技术的好奇心',
'关于程序员职业发展的思考：应该追求技术深度还是广度？',
3, true, false, 234, '2024-04-15 20:30:00'),

('Vue 3 Composition API 学习笔记', 'vue3-composition-api',
'## 为什么需要 Composition API

Vue 2 的 Options API 在复杂组件中存在代码分散的问题，Composition API 提供了更灵活的代码组织方式。

## 核心 API

### ref 和 reactive

```javascript
import { ref, reactive } from ''vue''

// 基本类型使用 ref
const count = ref(0)
console.log(count.value) // 0

// 对象类型使用 reactive
const state = reactive({
  name: ''John'',
  age: 25
})
```

### computed

```javascript
const doubled = computed(() => count.value * 2)
```

### watch 和 watchEffect

```javascript
// watch - 明确指定监听源
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})

// watchEffect - 自动追踪依赖
watchEffect(() => {
  console.log(count.value)
})
```

## 自定义 Composables

```javascript
function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}
```

## 与 React Hooks 的对比

- Vue 的 Composition API 在 setup 中只调用一次
- React Hooks 在每次渲染时都会调用
- Vue 不需要依赖数组，自动追踪依赖',
'Vue 3 Composition API 的学习笔记，对比 Options API 的优势和使用场景。',
1, true, false, 178, '2024-05-01 13:45:00'),

('《代码整洁之道》读书笔记', 'clean-code-notes',
'## 为什么读这本书

代码是写给人看的，顺便让机器执行。整洁的代码更易于维护和扩展。

## 核心要点

### 命名

- 名副其实
- 避免误导
- 做有意义的区分
- 使用可搜索的名字

### 函数

- 短小（不超过 20 行）
- 只做一件事
- 参数越少越好
- 避免副作用

### 注释

- 好的代码自己会说话
- 不要注释坏代码，重写它
- 必要的注释：法律、解释意图、警示

### 格式

- 垂直格式：相关代码靠近
- 水平格式：适当的缩进和空格

## 实践建议

1. 重构时逐步改进
2. Code Review 时关注代码整洁度
3. 建立团队的代码规范

## 我的感悟

这本书让我重新审视了自己的编码习惯。整洁的代码不是一蹴而就的，需要在日常开发中不断练习。',
'Robert C. Martin 的《代码整洁之道》读书笔记，总结了编写高质量代码的核心原则。',
4, true, true, 201, '2024-05-10 09:00:00');

-- Article tags
INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES
(1, 3), (1, 2),  -- hello-world: React, Spring Boot
(2, 1), (2, 2), (2, 7),  -- spring-boot-intro: Java, Spring Boot, 后端
(3, 3), (3, 4), (3, 6),  -- react-hooks: React, JavaScript, 前端
(4, 9), (4, 2), (4, 7),  -- docker: Docker, Spring Boot, 后端
(5, 8), (5, 4), (5, 6),  -- typescript: TypeScript, JavaScript, 前端
(6, 5), (6, 11),  -- mysql: 数据库, 性能优化
(7, 12), (7, 3), (7, 2),  -- blog-architecture: 架构设计, React, Spring Boot
(8, 10),  -- git: Git
(10, 6), (10, 4),  -- vue3: 前端, JavaScript
(11, 3), (11, 4), (11, 6);  -- clean-code: React, JavaScript, 前端 (using article 11 which doesn't exist, should be none)

-- Comments
INSERT IGNORE INTO comments (id, article_id, parent_id, author_name, content, is_approved, created_at) VALUES
(1, 1, NULL, '张三', '恭喜开博！期待更多精彩内容。', true, '2024-01-16 08:30:00'),
(2, 1, NULL, 'DevLearner', 'Nice blog setup! The tech stack looks solid.', true, '2024-01-17 14:20:00'),
(3, 1, 1, '管理员', '谢谢支持！会持续更新的。', true, '2024-01-16 10:15:00'),
(4, 2, NULL, 'Java学习者', '写得很清晰，正好在学 Spring Boot，收藏了！', true, '2024-01-22 16:45:00'),
(5, 2, NULL, 'BackendDev', 'Would be great to see a follow-up on Spring Boot with MyBatis-Plus.', true, '2024-01-25 09:30:00'),
(6, 3, NULL, '前端小白', 'useEffect 的依赖数组一直搞不清楚，看完这篇明白了！', true, '2024-02-08 11:20:00'),
(7, 3, NULL, 'ReactFan', 'The custom hooks section is really helpful. Thanks for sharing!', true, '2024-02-10 15:40:00'),
(8, 3, 6, '管理员', 'Hooks 确实需要多练习才能掌握，加油！', true, '2024-02-09 08:10:00'),
(9, 4, NULL, '运维工程师', 'Docker Compose 那段配置很实用，直接复制就能用。', true, '2024-02-18 10:30:00'),
(10, 4, NULL, 'CloudNative', 'Consider adding a section on Docker networking and volumes for production.', true, '2024-02-20 14:15:00'),
(11, 6, NULL, 'DBA新手', '联合索引的最左前缀原则终于搞懂了，感谢！', true, '2024-03-12 09:45:00'),
(12, 6, NULL, 'SQLMaster', 'Great explanation of EXPLAIN output. Could you add examples of covering indexes?', true, '2024-03-15 16:20:00'),
(13, 6, 11, '管理员', '不客气！索引优化是数据库性能的关键。', true, '2024-03-13 08:30:00'),
(14, 11, NULL, 'CodeReviewer', 'This book changed how I write code. Essential reading for every developer.', true, '2024-05-12 11:00:00'),
(15, 11, NULL, '编程爱好者', '函数不超过 20 行这个原则很值得践行，我现在写代码都会注意这点。', true, '2024-05-15 14:30:00');

-- AI News Sources
INSERT IGNORE INTO ai_news_source (source_key, source_name, feed_url, feed_type, enabled, sort_order) VALUES
('jiqizhixin', '机器之心', 'https://www.jiqizhixin.com/rss', 'RSS', true, 1),
('qbitai', '量子位', 'https://www.qbitai.com/feed', 'RSS', true, 2),
('36kr-ai', '36氪AI', 'https://36kr.com/feed', 'RSS', true, 3),
('infoq-cn', 'InfoQ中文', 'https://www.infoq.cn/feed', 'RSS', true, 4),
('hackernews', 'Hacker News', 'https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT', 'RSS', true, 5),
('openai-blog', 'OpenAI Blog', 'https://openai.com/blog/rss.xml', 'RSS', true, 6),
('anthropic-blog', 'Anthropic Blog', 'https://www.anthropic.com/blog/rss.xml', 'RSS', true, 7),
('deepmind-blog', 'DeepMind Blog', 'https://deepmind.google/blog/feed.xml', 'RSS', true, 8),
('mit-treview', 'MIT Tech Review AI', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'RSS', true, 9),
('arstechnica-ai', 'Ars Technica AI', 'https://feeds.arstechnica.com/arstechnica/ai', 'RSS', true, 10),
('arxiv-csai', 'arXiv CS.AI', 'https://rss.arxiv.org/rss/cs.AI', 'RSS', true, 11),
('arxiv-cscl', 'arXiv CS.CL', 'https://rss.arxiv.org/rss/cs.CL', 'RSS', true, 12),
('arxiv-cscv', 'arXiv CS.CV', 'https://rss.arxiv.org/rss/cs.CV', 'RSS', true, 13),
('huggingface-blog', 'Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'RSS', true, 14),
('langchain-blog', 'LangChain Blog', 'https://blog.langchain.dev/rss/', 'RSS', true, 15),
('meta-ai-blog', 'Meta AI Blog', 'https://ai.meta.com/blog/feed/', 'RSS', true, 16),
('stabilityai-blog', 'Stability AI Blog', 'https://stability.ai/news/rss.xml', 'RSS', true, 17),
('googleresearch', 'Google Research', 'https://blog.research.google/feeds/posts/default', 'ATOM', true, 18);
