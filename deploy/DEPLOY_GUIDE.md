# 前端部署指南

## 快速部署

### 一键部署（推荐）
```bash
# 部署所有前端（前台+后台）
python quick_deploy.py

# 只部署前台
python quick_deploy.py frontend

# 只部署后台
python quick_deploy.py admin
```

### 交互式部署
```bash
python deploy_frontend.py
```

## 部署流程

### 1. 本地构建
```bash
# 构建前台
cd d:\acode\blog\frontend
npm run build

# 构建后台
cd d:\acode\blog\frontend-admin
npm run build
```

### 2. 自动部署
脚本会自动：
1. 检查并构建项目
2. 上传dist目录到服务器
3. 备份旧文件
4. 重启Nginx

### 3. 访问地址
- **前台**: http://47.108.68.180/
- **后台**: http://47.108.68.180/admin/

## 部署架构

```
本地开发环境
├── frontend/          # 前台源码
│   └── dist/         # 构建产物
└── frontend-admin/   # 后台源码
    └── dist/         # 构建产物
          ↓ 上传
ECS服务器 (47.108.68.180)
├── /var/www/blog/frontend/dist/      # 前台部署目录
├── /var/www/blog/frontend-admin/dist/ # 后台部署目录
└── Nginx配置
    ├── / → frontend/dist
    └── /admin → frontend-admin/dist
```

## 注意事项

1. **构建前确保依赖已安装**
   ```bash
   npm install
   ```

2. **dist目录必须存在**
   - 脚本会自动检测并构建
   - 如果构建失败，请手动运行 `npm run build`

3. **服务器备份**
   - 每次部署会自动备份旧文件
   - 备份目录格式: `{path}_backup_{timestamp}`

4. **Nginx配置**
   - 部署后自动重启Nginx
   - 配置文件: `/etc/nginx/conf.d/blog.conf`

## 故障排除

### 构建失败
```bash
# 清除缓存重新构建
rm -rf node_modules dist
npm install
npm run build
```

### 上传失败
- 检查网络连接
- 确认服务器SSH服务正常
- 验证用户名密码正确

### 页面无法访问
```bash
# 检查Nginx状态
ssh root@47.108.68.180 "systemctl status nginx"

# 检查文件是否存在
ssh root@47.108.68.180 "ls -la /var/www/blog/frontend/dist/"
```