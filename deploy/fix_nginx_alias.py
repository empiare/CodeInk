#!/usr/bin/env python3
"""
检查并修复Nginx alias配置
"""
import paramiko
import sys

HOST = '47.108.68.180'
USER = 'root'
PASS = '990823Zl.'

def ssh_connect():
    """建立SSH连接"""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(HOST, username=USER, password=PASS, timeout=10)
        return client
    except Exception as e:
        print(f"SSH连接失败: {e}")
        return None

def run_command(client, command):
    """执行远程命令"""
    stdin, stdout, stderr = client.exec_command(command)
    return stdout.read().decode(), stderr.read().decode(), stdout.channel.recv_exit_status()

def fix_nginx_alias(client):
    """修复Nginx alias配置"""
    print("=== 修复Nginx alias配置 ===")
    
    # 检查当前配置
    print("\n1. 当前Nginx配置:")
    out, err, code = run_command(client, "cat /etc/nginx/conf.d/blog.conf")
    print(out)
    
    # 测试直接访问文件
    print("\n2. 测试直接访问JS文件:")
    out, err, code = run_command(client, "curl -s -I http://localhost/admin/assets/index-B4zCrj2X.js")
    print(out)
    
    # 检查文件是否存在
    print("\n3. 检查文件是否存在:")
    out, err, code = run_command(client, "ls -la /var/www/blog/frontend-admin/dist/assets/")
    print(out)
    
    # 修复alias配置 - 添加尾部斜杠
    print("\n4. 修复alias配置...")
    
    # 备份原配置
    run_command(client, "cp /etc/nginx/conf.d/blog.conf /etc/nginx/conf.d/blog.conf.backup2")
    
    # 创建新配置
    new_config = """server {
    listen 80;
    server_name 47.108.68.180;

    charset utf-8;
    client_max_body_size 10M;

    location / {
        root /var/www/blog/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /admin/ {
        alias /var/www/blog/frontend-admin/dist/;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    location /avatar/ {
        alias /var/www/blog/uploads/avatars/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}"""
    
    # 写入新配置
    run_command(client, f"echo '{new_config}' > /etc/nginx/conf.d/blog.conf")
    
    # 测试配置
    print("\n5. 测试Nginx配置:")
    out, err, code = run_command(client, "nginx -t 2>&1")
    print(out)
    
    # 重启Nginx
    print("\n6. 重启Nginx:")
    run_command(client, "systemctl reload nginx")
    print("✅ Nginx已重启")
    
    # 再次测试
    print("\n7. 测试修复后的JS文件访问:")
    out, err, code = run_command(client, "curl -s -I http://localhost/admin/assets/index-B4zCrj2X.js | grep -i 'content-type'")
    print(out)

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        fix_nginx_alias(client)
    finally:
        client.close()
        print("\n修复完成")

if __name__ == "__main__":
    main()