# 域名配置指南

## 快速配置

### 一键配置（推荐）
```bash
python configure_domain.py
```

脚本会自动：
1. 配置Nginx支持域名访问
2. 可选配置SSL证书（HTTPS）
3. 重启Nginx服务

## 配置步骤

### 步骤1：购买域名
1. 在域名注册商购买域名（如阿里云、腾讯云、GoDaddy等）
2. 常见域名后缀：
   - `.com` - 商业网站
   - `.cn` - 中国域名
   - `.net` - 网络服务
   - `.org` - 组织机构

### 步骤2：域名解析
在域名管理后台添加A记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | @ | 47.108.68.180 | 600 |
| A | www | 47.108.68.180 | 600 |

**说明：**
- `@` - 主域名（如 example.com）
- `www` - www子域名（如 www.example.com）
- `47.108.68.180` - 你的服务器IP

### 步骤3：配置Nginx
使用配置脚本：
```bash
python configure_domain.py
```

或手动配置：
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com 47.108.68.180;
    
    # ... 其他配置
}
```

### 步骤4：配置SSL（可选但推荐）
使用Let's Encrypt免费SSL证书：

```bash
# 安装certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 获取SSL证书
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期测试
certbot renew --dry-run
```

## 配置详情

### Nginx配置说明
```nginx
server {
    listen 80;                    # HTTP端口
    listen 443 ssl;              # HTTPS端口（配置SSL后）
    server_name domain.com;      # 域名
    
    # SSL证书配置（配置SSL后）
    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;
    
    # 前台前端
    location / {
        root /var/www/blog/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后台管理
    location /admin {
        alias /var/www/blog/frontend-admin/dist;
        try_files $uri $uri/ /admin/index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
    }
}
```

### SSL证书配置
Let's Encrypt证书特点：
- ✅ 免费
- ✅ 自动续期
- ✅ 广泛信任
- ✅ 支持多域名

## 验证配置

### 检查域名解析
```bash
# Windows
nslookup yourdomain.com

# Linux/Mac
dig yourdomain.com
```

### 检查Nginx配置
```bash
# 测试配置
nginx -t

# 查看配置
cat /etc/nginx/conf.d/blog.conf
```

### 检查SSL证书
```bash
# 查看证书信息
certbot certificates

# 测试续期
certbot renew --dry-run
```

## 访问地址

配置完成后，可通过以下地址访问：

### HTTP访问
- 前台：http://yourdomain.com/
- 后台：http://yourdomain.com/admin/

### HTTPS访问（配置SSL后）
- 前台：https://yourdomain.com/
- 后台：https://yourdomain.com/admin/

## 常见问题

### 1. 域名无法访问
**可能原因：**
- DNS解析未生效（等待几分钟到几小时）
- 域名未正确解析到服务器IP
- 服务器防火墙阻止80/443端口

**解决方案：**
```bash
# 检查DNS解析
nslookup yourdomain.com

# 检查服务器防火墙
ufw status
iptables -L
```

### 2. SSL证书配置失败
**可能原因：**
- 域名解析未生效
- 80端口被占用
- certbot未正确安装

**解决方案：**
```bash
# 检查80端口
netstat -tlnp | grep :80

# 重新安装certbot
apt-get remove certbot
apt-get install certbot python3-certbot-nginx
```

### 3. 证书过期
Let's Encrypt证书有效期90天，会自动续期。

**手动续期：**
```bash
certbot renew
systemctl reload nginx
```

## 安全建议

1. **启用HTTPS**
   - 使用SSL证书加密传输
   - 配置HTTP到HTTPS重定向

2. **配置安全头**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   ```

3. **限制访问**
   - 配置防火墙规则
   - 限制API访问频率

4. **定期更新**
   - 更新Nginx版本
   - 更新SSL证书
   - 更新服务器系统

## 监控和维护

### 检查服务状态
```bash
# Nginx状态
systemctl status nginx

# 证书状态
certbot certificates

# 日志查看
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 自动续期配置
Let's Encrypt证书会自动续期，可通过以下命令检查：
```bash
# 测试续期
certbot renew --dry-run

# 查看续期定时任务
systemctl list-timers | grep certbot
```