# CodeInk

一个现代化的前后端分离个人技术博客系统，使用 React + Spring Boot 构建。

## 功能特性

### 前台功能
- 📝 文章浏览与 Markdown 渲染
- 🔍 全文搜索
- 📂 分类与标签导航
- 🌙 暗黑模式切换
- 💬 评论系统（支持嵌套回复）
- 👤 用户注册/登录
- 🔐 Google OAuth 2.0 第三方登录
- 📱 响应式设计

### 后台管理
- 📊 数据统计仪表盘
- ✍️ 文章编辑器（Markdown）
- 📁 分类管理
- 🏷️ 标签管理
- 💬 评论审核

## 技术栈

### 前端
| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.x | UI 框架 |
| Vite | 8.x | 构建工具 |
| React Router | 7.x | 路由管理 |
| Axios | 1.x | HTTP 客户端 |
| react-markdown | 10.x | Markdown 渲染 |
| Lucide React | 1.x | 图标库 |

### 后端
| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.2.x | 应用框架 |
| Spring Security | - | 安全框架 |
| MyBatis-Plus | 3.5.x | ORM 框架 |
| MySQL | 8.x | 数据库 |
| JJWT | 0.12.x | JWT 认证 |
| Lombok | - | 代码简化 |

## 项目结构

```
CodeInk/
├── backend/                # 后端 Spring Boot 项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/myblog/
│   │   │   │   ├── config/       # 配置类（Security、JWT、MyBatis）
│   │   │   │   ├── controller/   # REST 控制器
│   │   │   │   ├── exception/    # 异常处理
│   │   │   │   ├── mapper/       # MyBatis Mapper 接口
│   │   │   │   ├── model/        # 实体类与 DTO
│   │   │   │   ├── service/      # 业务逻辑层
│   │   │   │   └── util/         # 工具类
│   │   │   └── resources/
│   │   │       ├── mapper/       # MyBatis XML 映射文件
│   │   │       ├── application.yml
│   │   │       ├── schema.sql    # 数据库表结构
│   │   │       └── data.sql      # 初始数据
│   │   └── test/
│   └── pom.xml
├── frontend/               # 前台 React 应用
│   ├── src/
│   │   ├── api/            # API 请求封装
│   │   ├── components/     # 通用组件
│   │   ├── context/        # React Context
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── pages/          # 页面组件
│   │   └── styles/         # 样式文件
│   └── package.json
└── frontend-admin/         # 后台管理 React 应用
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/          # 管理页面
    │   └── styles/
    └── package.json
```

## 快速开始

### 环境要求

- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### 1. 克隆项目

```bash
git clone https://github.com/empiare/CodeInk.git
cd CodeInk
```

### 2. 数据库配置

创建 MySQL 数据库：

```sql
CREATE DATABASE myblog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

修改 `backend/src/main/resources/application.yml` 中的数据库配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/myblog?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
```

### 3. 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端将在 http://localhost:8080 启动。

首次运行会自动执行 `schema.sql` 创建表结构。如需初始化示例数据，将 `application.yml` 中 `spring.sql.init.mode` 改为 `always`。

### 4. 启动前台

```bash
cd frontend
npm install
npm run dev
```

前台将在 http://localhost:3000 启动。

### 5. 启动后台管理

```bash
cd frontend-admin
npm install
npm run dev
```

后台管理将在 http://localhost:3001 启动（或自动分配端口）。

## API 接口

### 文章
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/articles | 获取已发布文章列表（分页） |
| GET | /api/articles/{slug} | 根据 slug 获取文章详情 |
| GET | /api/articles/featured | 获取精选文章 |
| POST | /api/articles | 创建文章 |
| PUT | /api/articles/{id} | 更新文章 |
| DELETE | /api/articles/{id} | 删除文章 |

### 分类
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/categories | 获取所有分类 |
| POST | /api/categories | 创建分类 |
| PUT | /api/categories/{id} | 更新分类 |
| DELETE | /api/categories/{id} | 删除分类 |

### 标签
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tags | 获取所有标签 |
| POST | /api/tags | 创建标签 |
| DELETE | /api/tags/{id} | 删除标签 |

### 评论
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/articles/{id}/comments | 获取文章评论 |
| POST | /api/articles/{id}/comments | 发表评论 |

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/google | Google OAuth 登录 |

### 统计
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/stats | 获取博客统计数据 |

### 搜索
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/search?keyword=xxx | 搜索文章 |

## 部署说明

### 前端构建

```bash
cd frontend
npm run build
```

构建产物将输出到 `frontend/dist` 目录，可部署到 Nginx 或其他静态文件服务器。

### 后端打包

```bash
cd backend
mvn clean package
```

生成的 JAR 文件位于 `backend/target/` 目录，使用以下命令运行：

```bash
java -jar target/my-blog-1.0.0.jar
```

## 许可证

MIT License

## 作者

CodeInk Blog - 一个热爱技术的开发者
