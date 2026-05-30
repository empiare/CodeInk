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

def check_deployment(client):
    """检查部署状态"""
    print("=== 检查部署状态 ===")
    
    # 检查部署目录
    print("\n1. 检查部署目录...")
    out, err, code = run_command(client, "ls -la /var/www/blog/ 2>/dev/null || echo '目录不存在'")
    if "目录不存在" in out:
        print("❌ 部署目录 /var/www/blog/ 不存在")
        return False
    else:
        print("✅ 部署目录存在")
        print(out)
    
    # 检查前端文件
    print("\n2. 检查前端文件...")
    out, err, code = run_command(client, "ls -la /var/www/blog/frontend/dist/ 2>/dev/null || echo '前端文件不存在'")
    if "前端文件不存在" in out:
        print("❌ 前端文件未部署")
    else:
        print("✅ 前端文件存在")
    
    # 检查管理后台文件
    print("\n3. 检查管理后台文件...")
    out, err, code = run_command(client, "ls -la /var/www/blog/frontend-admin/dist/ 2>/dev/null || echo '管理后台文件不存在'")
    if "管理后台文件不存在" in out:
        print("❌ 管理后台文件未部署")
    else:
        print("✅ 管理后台文件存在")
    
    # 检查后端JAR文件
    print("\n4. 检查后端文件...")
    out, err, code = run_command(client, "ls -la /var/www/blog/backend/*.jar 2>/dev/null || echo '后端JAR文件不存在'")
    if "后端JAR文件不存在" in out:
        print("❌ 后端JAR文件未部署")
    else:
        print("✅ 后端JAR文件存在")
        print(out)
    
    # 检查Nginx配置
    print("\n5. 检查Nginx配置...")
    out, err, code = run_command(client, "nginx -t 2>&1")
    if "successful" in out.lower() or "syntax is ok" in out.lower():
        print("✅ Nginx配置正确")
    else:
        print("⚠️ Nginx配置可能有问题:")
        print(out)
    
    # 检查Nginx服务状态
    print("\n6. 检查Nginx服务状态...")
    out, err, code = run_command(client, "systemctl is-active nginx 2>/dev/null || service nginx status 2>/dev/null | head -5")
    if "active" in out.lower() or "running" in out.lower():
        print("✅ Nginx服务运行中")
    else:
        print("❌ Nginx服务未运行")
        print(out)
    
    # 检查后端Java服务
    print("\n7. 检查后端Java服务...")
    out, err, code = run_command(client, "ps aux | grep -E 'java.*myblog|myblog.*jar' | grep -v grep || echo 'Java服务未运行'")
    if "Java服务未运行" in out:
        print("❌ 后端Java服务未运行")
    else:
        print("✅ 后端Java服务运行中")
        print(out)
    
    # 检查端口监听
    print("\n8. 检查端口监听...")
    out, err, code = run_command(client, "netstat -tlnp 2>/dev/null | grep -E ':80|:8080' || ss -tlnp 2>/dev/null | grep -E ':80|:8080'")
    print("端口监听状态:")
    print(out)
    
    return True

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        check_deployment(client)
    finally:
        client.close()
        print("\n检查完成")

if __name__ == "__main__":
    main()