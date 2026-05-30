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

def check_admin_access(client):
    """检查后台管理访问方式"""
    print("=== 后台管理访问方式 ===")
    
    # 检查后台管理登录API
    print("\n1. 检查后台管理登录API:")
    out, err, code = run_command(client, "curl -s -X POST http://localhost/api/auth/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"admin123\"}' 2>/dev/null | head -c 200")
    print(f"登录API响应: {out}")
    
    # 检查后台管理用户表
    print("\n2. 检查后台管理用户表:")
    out, err, code = run_command(client, "mysql -u root -p'990823Zl.' -e 'USE myblog; SELECT id, username, role FROM users LIMIT 5;' 2>/dev/null || echo '查询失败'")
    print(out)
    
    # 检查后台管理路由配置
    print("\n3. 检查后台管理路由配置:")
    out, err, code = run_command(client, "cat /var/www/blog/frontend-admin/dist/index.html | grep -i 'script\\|route\\|admin' | head -10")
    print(out)
    
    # 检查后台管理API端点
    print("\n4. 检查后台管理API端点:")
    out, err, code = run_command(client, "curl -s http://localhost/api/admin/articles 2>/dev/null | head -c 200 || echo 'API测试失败'")
    print(f"文章管理API: {out}")
    
    out, err, code = run_command(client, "curl -s http://localhost/api/admin/users 2>/dev/null | head -c 200 || echo 'API测试失败'")
    print(f"用户管理API: {out}")
    
    # 检查后台管理功能模块
    print("\n5. 检查后台管理功能模块:")
    out, err, code = run_command(client, "ls -la /var/www/blog/frontend-admin/dist/assets/")
    print(out)

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        check_admin_access(client)
    finally:
        client.close()
        print("\n检查完成")

if __name__ == "__main__":
    main()