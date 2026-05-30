#!/usr/bin/env python3
"""
域名配置脚本
配置Nginx支持域名访问
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

def configure_domain(client, domain):
    """配置域名"""
    print(f"\n=== 配置域名: {domain} ===")
    
    # 备份原配置
    print("1. 备份原配置...")
    run_command(client, "cp /etc/nginx/conf.d/blog.conf /etc/nginx/conf.d/blog.conf.backup")
    
    # 创建新的Nginx配置
    print("2. 创建新的Nginx配置...")
    nginx_config = f"""server {{
    listen 80;
    server_name {domain} 47.108.68.180;
    
    charset utf-8;
    client_max_body_size 10M;
    
    # 前台前端
    location / {{
        root /var/www/blog/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }}
    
    # 后台管理
    location /admin {{
        alias /var/www/blog/frontend-admin/dist;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }}
    
    # API代理
    location /api/ {{
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }}
    
    # 头像文件
    location /avatar/ {{
        alias /var/www/blog/uploads/avatars/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }}
    
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {{
        root /usr/share/nginx/html;
    }}
}}"""
    
    # 写入配置文件
    run_command(client, f"echo '{nginx_config}' > /etc/nginx/conf.d/blog.conf")
    
    # 测试Nginx配置
    print("3. 测试Nginx配置...")
    out, err, code = run_command(client, "nginx -t")
    if "successful" in out.lower() or "syntax is ok" in out.lower():
        print("✅ Nginx配置测试成功")
    else:
        print(f"❌ Nginx配置测试失败: {out}")
        return False
    
    # 重启Nginx
    print("4. 重启Nginx...")
    run_command(client, "systemctl reload nginx")
    print("✅ Nginx已重启")
    
    return True

def configure_ssl(client, domain):
    """配置SSL证书（Let's Encrypt）"""
    print(f"\n=== 配置SSL证书: {domain} ===")
    
    # 安装certbot
    print("1. 安装certbot...")
    run_command(client, "apt-get update && apt-get install -y certbot python3-certbot-nginx")
    
    # 获取SSL证书
    print("2. 获取SSL证书...")
    out, err, code = run_command(client, f"certbot --nginx -d {domain} --non-interactive --agree-tos --email admin@{domain}")
    if code == 0:
        print("✅ SSL证书配置成功")
        return True
    else:
        print(f"❌ SSL证书配置失败: {err}")
        return False

def main():
    # 获取用户输入
    print("=== 域名配置工具 ===")
    print("\n请提供以下信息:")
    
    domain = input("请输入您的域名 (例如: example.com): ").strip()
    if not domain:
        print("❌ 域名不能为空")
        return
    
    ssl_choice = input("是否配置SSL证书？(y/n): ").strip().lower()
    configure_ssl_flag = ssl_choice == 'y'
    
    # 连接服务器
    print(f"\n连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        print("❌ 无法连接服务器")
        return
    
    try:
        # 配置域名
        if configure_domain(client, domain):
            print(f"\n✅ 域名 {domain} 配置成功！")
            
            # 配置SSL
            if configure_ssl_flag:
                configure_ssl(client, domain)
            
            # 显示访问地址
            print(f"\n{'='*50}")
            print("配置完成！")
            print(f"{'='*50}")
            print(f"\n访问地址:")
            print(f"  HTTP: http://{domain}/")
            print(f"  HTTP: http://{domain}/admin/")
            if configure_ssl_flag:
                print(f"  HTTPS: https://{domain}/")
                print(f"  HTTPS: https://{domain}/admin/")
            
            print(f"\n注意事项:")
            print(f"1. 请确保域名已解析到 {HOST}")
            print(f"2. DNS解析可能需要几分钟到几小时生效")
            if configure_ssl_flag:
                print(f"3. SSL证书已自动配置，支持HTTPS访问")
                print(f"4. 证书会自动续期")
        else:
            print("\n❌ 域名配置失败")
    
    finally:
        client.close()

if __name__ == "__main__":
    main()