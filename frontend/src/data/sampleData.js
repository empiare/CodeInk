// Sample data for development and testing
// This data structure matches the backend DTOs

export const sampleCategories = [
  {
    id: 1,
    name: '技术笔记',
    slug: 'tech-notes',
    description: '编程和技术相关的笔记',
  },
  {
    id: 2,
    name: '项目实战',
    slug: 'projects',
    description: '项目开发过程中的记录',
  },
  {
    id: 3,
    name: '随笔',
    slug: 'essays',
    description: '日常思考和随想',
  },
  {
    id: 4,
    name: '读书笔记',
    slug: 'reading-notes',
    description: '阅读技术书籍的笔记和感悟',
  },
  {
    id: 5,
    name: '工具推荐',
    slug: 'tools',
    description: '好用的开发工具和效率工具',
  },
];

export const sampleTags = [
  { id: 1, name: 'Java', slug: 'java' },
  { id: 2, name: 'Spring Boot', slug: 'spring-boot' },
  { id: 3, name: 'React', slug: 'react' },
  { id: 4, name: 'JavaScript', slug: 'javascript' },
  { id: 5, name: '数据库', slug: 'database' },
  { id: 6, name: '前端', slug: 'frontend' },
  { id: 7, name: '后端', slug: 'backend' },
  { id: 8, name: 'TypeScript', slug: 'typescript' },
  { id: 9, name: 'Docker', slug: 'docker' },
  { id: 10, name: 'Git', slug: 'git' },
  { id: 11, name: '性能优化', slug: 'performance' },
  { id: 12, name: '架构设计', slug: 'architecture' },
];

export const sampleArticles = [
  {
    id: 1,
    title: '你好，欢迎来到我的博客',
    slug: 'hello-world',
    summary: '这是我的第一篇博客文章，记录搭建博客的初衷和技术选型。',
    content: `## 开篇

这是我的第一篇博客文章。搭建这个博客的目的是为了记录自己在技术学习和项目实践中的思考与总结。

## 关于我

我是一名开发者，喜欢探索新技术，也喜欢用文字整理自己的想法。

## 博客技术栈

- 前端：React 18 + Vite
- 后端：Spring Boot 3.x + MyBatis-Plus
- 数据库：MySQL

希望这里能成为我持续输出的地方。`,
    category: { id: 1, name: '技术笔记', slug: 'tech-notes', description: '编程和技术相关的笔记' },
    tags: [
      { id: 3, name: 'React', slug: 'react' },
      { id: 2, name: 'Spring Boot', slug: 'spring-boot' },
    ],
    published: true,
    featured: true,
    viewCount: 42,
    publishedAt: '2024-01-15T10:00:00',
  },
  {
    id: 2,
    title: 'Spring Boot 入门指南',
    slug: 'spring-boot-intro',
    summary: 'Spring Boot 框架入门介绍，涵盖核心特性和快速上手方法。',
    content: `## 什么是 Spring Boot

Spring Boot 是 Spring 框架的快速开发脚手架，它通过约定大于配置的理念，让开发者能够快速搭建独立运行的 Spring 应用。

## 核心特性

- 自动配置（Auto Configuration）
- 起步依赖（Starter Dependencies）
- 内嵌服务器（Tomcat/Jetty）
- 生产就绪特性（Actuator）

## 快速开始

\`\`\`java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
\`\`\`

## 配置文件

Spring Boot 支持 \`application.yml\` 和 \`application.properties\` 两种格式，推荐使用 YAML 格式。`,
    category: { id: 1, name: '技术笔记', slug: 'tech-notes', description: '编程和技术相关的笔记' },
    tags: [
      { id: 1, name: 'Java', slug: 'java' },
      { id: 2, name: 'Spring Boot', slug: 'spring-boot' },
      { id: 7, name: '后端', slug: 'backend' },
    ],
    published: true,
    featured: false,
    viewCount: 128,
    publishedAt: '2024-01-20T14:30:00',
  },
  {
    id: 3,
    title: 'React Hooks 最佳实践',
    slug: 'react-hooks-best-practices',
    summary: '深入探讨 React Hooks 的使用技巧和常见陷阱，帮助你写出更优雅的 React 代码。',
    content: `## 为什么使用 Hooks

React Hooks 让函数组件拥有了状态管理能力，告别了 class 组件的繁琐写法。

## useState 使用技巧

\`\`\`javascript
// 错误示例
const [count, setCount] = useState(0);
setCount(count + 1); // 可能导致闭包问题

// 正确示例
setCount(prev => prev + 1); // 使用函数式更新
\`\`\`

## useEffect 注意事项

1. 清理副作用
2. 依赖数组的正确使用
3. 避免不必要的重新渲染

## 自定义 Hooks

将复杂逻辑抽取为自定义 Hooks，提高代码复用性：

\`\`\`javascript
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
\`\`\``,
    category: { id: 1, name: '技术笔记', slug: 'tech-notes', description: '编程和技术相关的笔记' },
    tags: [
      { id: 3, name: 'React', slug: 'react' },
      { id: 4, name: 'JavaScript', slug: 'javascript' },
      { id: 6, name: '前端', slug: 'frontend' },
    ],
    published: true,
    featured: true,
    viewCount: 256,
    publishedAt: '2024-02-05T09:15:00',
  },
  {
    id: 4,
    title: '使用 Docker 部署 Spring Boot 应用',
    slug: 'docker-spring-boot',
    summary: '手把手教你使用 Docker 容器化部署 Spring Boot 应用，实现一键部署。',
    content: `## 为什么要使用 Docker

Docker 提供了一致的运行环境，解决了"在我机器上能运行"的问题。

## 编写 Dockerfile

\`\`\`dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

## Docker Compose 编排

\`\`\`yaml
version: '3.8'
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
\`\`\`

## 生产环境建议

- 使用多阶段构建减小镜像体积
- 配置健康检查
- 使用 Docker Secrets 管理敏感信息`,
    category: { id: 2, name: '项目实战', slug: 'projects', description: '项目开发过程中的记录' },
    tags: [
      { id: 9, name: 'Docker', slug: 'docker' },
      { id: 2, name: 'Spring Boot', slug: 'spring-boot' },
      { id: 7, name: '后端', slug: 'backend' },
    ],
    published: true,
    featured: false,
    viewCount: 189,
    publishedAt: '2024-02-15T16:45:00',
  },
  {
    id: 5,
    title: 'TypeScript 类型体操入门',
    slug: 'typescript-type-gymnastics',
    summary: '探索 TypeScript 类型系统的强大能力，从基础类型操作到复杂类型推导。',
    content: `## 什么是类型体操

TypeScript 的类型系统是图灵完备的，这意味着我们可以在类型层面进行复杂的计算。

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## 递归类型

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};
\`\`\`

## 实际应用场景

- API 响应类型推导
- 表单验证类型安全
- 状态管理类型约束`,
    category: { id: 1, name: '技术笔记', slug: 'tech-notes', description: '编程和技术相关的笔记' },
    tags: [
      { id: 8, name: 'TypeScript', slug: 'typescript' },
      { id: 4, name: 'JavaScript', slug: 'javascript' },
      { id: 6, name: '前端', slug: 'frontend' },
    ],
    published: true,
    featured: false,
    viewCount: 167,
    publishedAt: '2024-03-01T11:20:00',
  },
  {
    id: 6,
    title: 'MySQL 索引优化实战',
    slug: 'mysql-index-optimization',
    summary: '通过实际案例讲解 MySQL 索引的原理和优化技巧，提升查询性能。',
    content: `## 索引的本质

索引是一种数据结构，用于快速查找数据。MySQL 中最常用的是 B+ 树索引。

## 索引类型

1. 主键索引
2. 唯一索引
3. 普通索引
4. 联合索引
5. 全文索引

## 联合索引的最左前缀原则

\`\`\`sql
-- 创建联合索引
CREATE INDEX idx_name_age ON users(name, age);

-- 可以使用索引的查询
SELECT * FROM users WHERE name = 'John';
SELECT * FROM users WHERE name = 'John' AND age = 25;

-- 无法使用索引的查询
SELECT * FROM users WHERE age = 25;
\`\`\`

## EXPLAIN 分析

\`\`\`sql
EXPLAIN SELECT * FROM articles WHERE category_id = 1;
\`\`\`

关注字段：type, key, rows, Extra

## 优化建议

- 避免在索引列上使用函数
- 使用覆盖索引减少回表
- 控制索引数量，避免过度索引`,
    category: { id: 1, name: '技术笔记', slug: 'tech-notes', description: '编程和技术相关的笔记' },
    tags: [
      { id: 5, name: '数据库', slug: 'database' },
      { id: 11, name: '性能优化', slug: 'performance' },
    ],
    published: true,
    featured: true,
    viewCount: 312,
    publishedAt: '2024-03-10T08:30:00',
  },
  {
    id: 7,
    title: '个人博客系统开发记录（一）：架构设计',
    slug: 'blog-system-architecture',
    summary: '记录个人博客系统从零开始的架构设计过程，包括技术选型和数据库设计。',
    content: `## 项目背景

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

\`\`\`sql
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
\`\`\`

## API 设计原则

- RESTful 风格
- 统一响应格式
- 合理的错误处理`,
    category: { id: 2, name: '项目实战', slug: 'projects', description: '项目开发过程中的记录' },
    tags: [
      { id: 12, name: '架构设计', slug: 'architecture' },
      { id: 3, name: 'React', slug: 'react' },
      { id: 2, name: 'Spring Boot', slug: 'spring-boot' },
    ],
    published: true,
    featured: false,
    viewCount: 95,
    publishedAt: '2024-03-20T15:00:00',
  },
  {
    id: 8,
    title: 'Git 工作流最佳实践',
    slug: 'git-workflow-best-practices',
    summary: '介绍几种常见的 Git 工作流，帮助团队选择合适的协作方式。',
    content: `## 为什么需要 Git 工作流

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
- 高频发布 + Feature Flags：Trunk Based`,
    category: { id: 5, name: '工具推荐', slug: 'tools', description: '好用的开发工具和效率工具' },
    tags: [
      { id: 10, name: 'Git', slug: 'git' },
    ],
    published: true,
    featured: false,
    viewCount: 143,
    publishedAt: '2024-04-02T10:15:00',
  },
  {
    id: 9,
    title: '程序员的思考：技术深度 vs 广度',
    slug: 'tech-depth-vs-breadth',
    summary: '关于程序员职业发展的思考：应该追求技术深度还是广度？',
    content: `## 引言

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

\`\`\`
  广度（了解多个领域）
  ─────────────────────
       │
       │ 深度
       │（精通核心领域）
       │
\`\`\`

## 实践建议

1. 前 3-5 年：专注于一个方向
2. 5 年后：开始横向扩展
3. 持续学习：保持对新技术的好奇心`,
    category: { id: 3, name: '随笔', slug: 'essays', description: '日常思考和随想' },
    tags: [],
    published: true,
    featured: false,
    viewCount: 234,
    publishedAt: '2024-04-15T20:30:00',
  },
  {
    id: 10,
    title: 'Vue 3 Composition API 学习笔记',
    slug: 'vue3-composition-api',
    summary: 'Vue 3 Composition API 的学习笔记，对比 Options API 的优势和使用场景。',
    content: `## 为什么需要 Composition API

Vue 2 的 Options API 在复杂组件中存在代码分散的问题，Composition API 提供了更灵活的代码组织方式。

## 核心 API

### ref 和 reactive

\`\`\`javascript
import { ref, reactive } from 'vue'

// 基本类型使用 ref
const count = ref(0)
console.log(count.value) // 0

// 对象类型使用 reactive
const state = reactive({
  name: 'John',
  age: 25
})
\`\`\`

### computed

\`\`\`javascript
const doubled = computed(() => count.value * 2)
\`\`\`

### watch 和 watchEffect

\`\`\`javascript
// watch - 明确指定监听源
watch(count, (newVal, oldVal) => {
  console.log(\`count changed from \${oldVal} to \${newVal}\`)
})

// watchEffect - 自动追踪依赖
watchEffect(() => {
  console.log(count.value)
})
\`\`\`

## 自定义 Composables

\`\`\`javascript
function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}
\`\`\`

## 与 React Hooks 的对比

- Vue 的 Composition API 在 setup 中只调用一次
- React Hooks 在每次渲染时都会调用
- Vue 不需要依赖数组，自动追踪依赖`,
    category: { id: 1, name: '技术笔记', slug: 'tech-notes', description: '编程和技术相关的笔记' },
    tags: [
      { id: 6, name: '前端', slug: 'frontend' },
      { id: 4, name: 'JavaScript', slug: 'javascript' },
    ],
    published: true,
    featured: false,
    viewCount: 178,
    publishedAt: '2024-05-01T13:45:00',
  },
  {
    id: 11,
    title: '代码整洁之道读书笔记',
    slug: 'clean-code-notes',
    summary: 'Robert C. Martin 的《代码整洁之道》读书笔记，总结了编写高质量代码的核心原则。',
    content: `## 为什么读这本书

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

这本书让我重新审视了自己的编码习惯。整洁的代码不是一蹴而就的，需要在日常开发中不断练习。`,
    category: { id: 4, name: '读书笔记', slug: 'reading-notes', description: '阅读技术书籍的笔记和感悟' },
    tags: [],
    published: true,
    featured: true,
    viewCount: 201,
    publishedAt: '2024-05-10T09:00:00',
  },
];

export const sampleComments = [
  // Comments for article 1 (hello-world)
  {
    id: 1,
    articleId: 1,
    parentId: null,
    authorName: '张三',
    content: '恭喜开博！期待更多精彩内容。',
    approved: true,
    createdAt: '2024-01-16T08:30:00',
  },
  {
    id: 2,
    articleId: 1,
    parentId: null,
    authorName: 'DevLearner',
    content: 'Nice blog setup! The tech stack looks solid.',
    approved: true,
    createdAt: '2024-01-17T14:20:00',
  },
  {
    id: 3,
    articleId: 1,
    parentId: 1,
    authorName: '管理员',
    content: '谢谢支持！会持续更新的。',
    approved: true,
    createdAt: '2024-01-16T10:15:00',
  },
  // Comments for article 2 (spring-boot-intro)
  {
    id: 4,
    articleId: 2,
    parentId: null,
    authorName: 'Java学习者',
    content: '写得很清晰，正好在学 Spring Boot，收藏了！',
    approved: true,
    createdAt: '2024-01-22T16:45:00',
  },
  {
    id: 5,
    articleId: 2,
    parentId: null,
    authorName: 'BackendDev',
    content: 'Would be great to see a follow-up on Spring Boot with MyBatis-Plus.',
    approved: true,
    createdAt: '2024-01-25T09:30:00',
  },
  // Comments for article 3 (react-hooks-best-practices)
  {
    id: 6,
    articleId: 3,
    parentId: null,
    authorName: '前端小白',
    content: 'useEffect 的依赖数组一直搞不清楚，看完这篇明白了！',
    approved: true,
    createdAt: '2024-02-08T11:20:00',
  },
  {
    id: 7,
    articleId: 3,
    parentId: null,
    authorName: 'ReactFan',
    content: 'The custom hooks section is really helpful. Thanks for sharing!',
    approved: true,
    createdAt: '2024-02-10T15:40:00',
  },
  {
    id: 8,
    articleId: 3,
    parentId: 6,
    authorName: '管理员',
    content: 'Hooks 确实需要多练习才能掌握，加油！',
    approved: true,
    createdAt: '2024-02-09T08:10:00',
  },
  // Comments for article 4 (docker-spring-boot)
  {
    id: 9,
    articleId: 4,
    parentId: null,
    authorName: '运维工程师',
    content: 'Docker Compose 那段配置很实用，直接复制就能用。',
    approved: true,
    createdAt: '2024-02-18T10:30:00',
  },
  {
    id: 10,
    articleId: 4,
    parentId: null,
    authorName: 'CloudNative',
    content: 'Consider adding a section on Docker networking and volumes for production.',
    approved: true,
    createdAt: '2024-02-20T14:15:00',
  },
  // Comments for article 6 (mysql-index-optimization)
  {
    id: 11,
    articleId: 6,
    parentId: null,
    authorName: 'DBA新手',
    content: '联合索引的最左前缀原则终于搞懂了，感谢！',
    approved: true,
    createdAt: '2024-03-12T09:45:00',
  },
  {
    id: 12,
    articleId: 6,
    parentId: null,
    authorName: 'SQLMaster',
    content: 'Great explanation of EXPLAIN output. Could you add examples of covering indexes?',
    approved: true,
    createdAt: '2024-03-15T16:20:00',
  },
  {
    id: 13,
    articleId: 6,
    parentId: 11,
    authorName: '管理员',
    content: '不客气！索引优化是数据库性能的关键。',
    approved: true,
    createdAt: '2024-03-13T08:30:00',
  },
  // Comments for article 11 (clean-code-notes)
  {
    id: 14,
    articleId: 11,
    parentId: null,
    authorName: 'CodeReviewer',
    content: 'This book changed how I write code. Essential reading for every developer.',
    approved: true,
    createdAt: '2024-05-12T11:00:00',
  },
  {
    id: 15,
    articleId: 11,
    parentId: null,
    authorName: '编程爱好者',
    content: '函数不超过 20 行这个原则很值得践行，我现在写代码都会注意这点。',
    approved: true,
    createdAt: '2024-05-15T14:30:00',
  },
];

// Helper function to get comments for a specific article
export function getCommentsByArticleId(articleId) {
  return sampleComments.filter((comment) => comment.articleId === articleId);
}

// Helper function to get article by slug
export function getArticleBySlug(slug) {
  return sampleArticles.find((article) => article.slug === slug);
}

// Helper function to get articles by category
export function getArticlesByCategorySlug(categorySlug) {
  return sampleArticles.filter(
    (article) => article.category?.slug === categorySlug
  );
}

// Helper function to get articles by tag
export function getArticlesByTagSlug(tagSlug) {
  return sampleArticles.filter((article) =>
    article.tags?.some((tag) => tag.slug === tagSlug)
  );
}
