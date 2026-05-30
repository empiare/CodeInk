#!/usr/bin/env python3
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

def check_admin_deployment(client):
    """检查后台管理部署详情"""
    print("=== 后台管理部署详情 ===")
    
    # 检查后台管理文件
    print("\n1. 后台管理文件结构:")
    out, err, code = run_command(client, "ls -la /var/www/blog/frontend-admin/dist/")
    print(out)
    
    # 检查Nginx配置中的admin路由
    print("\n2. Nginx admin路由配置:")
    out, err, code = run_command(client, "grep -A 10 -B 2 'location /admin' /etc/nginx/conf.d/blog.conf")
    print(out)
    
    # 测试后台管理访问
    print("\n3. 测试后台管理访问:")
    out, err, code = run_command(client, "curl -s -o /dev/null -w 'HTTP状态码: %{http_code}\n响应大小: %{size_download} bytes\n' http://localhost/admin/")
    print(out)
    
    # 检查后台管理API代理
    print("\n4. 检查后台管理API代理:")
    out, err, code = run_command(client, "curl -s -o /dev/null -w 'HTTP状态码: %{http_code}\n' http://localhost/api/admin/dashboard 2>/dev/null || echo 'API测试失败'")
    print(out)
    
    # 检查后台管理登录页面
    print("\n5. 检查后台管理登录页面:")
    out, err, code = run_command(client, "curl -s http://localhost/admin/ | grep -i 'login\\|admin\\|dashboard' | head -5")
    print(out)
    
    # 检查后台管理静态资源
    print("\n6. 检查后台管理静态资源:")
    out, err, code = run_command(client, "curl -s -o /dev/null -w 'HTTP状态码: %{http_code}\n' http://localhost/admin/assets/index-COd4M5Mf.js 2>/dev/null || echo '静态资源测试失败'")
    print(out)

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        check_admin_deployment(client)
    finally:
        client.close()
        print("\n检查完成")

if __name__ == "__main__":
    main()