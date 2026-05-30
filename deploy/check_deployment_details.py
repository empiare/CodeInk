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

def check_deployment_details(client):
    """检查部署详情"""
    print("=== 部署详情检查 ===")
    
    # 检查部署目录结构
    print("\n1. 部署目录结构:")
    out, err, code = run_command(client, "find /var/www/blog -type f -name '*.jar' -o -name '*.html' -o -name '*.js' -o -name '*.css' | head -20")
    print(out)
    
    # 检查Nginx配置文件
    print("\n2. Nginx配置文件:")
    out, err, code = run_command(client, "cat /etc/nginx/conf.d/blog.conf 2>/dev/null || cat /etc/nginx/sites-available/blog 2>/dev/null || echo '配置文件位置未知'")
    print(out)
    
    # 检查systemd服务文件
    print("\n3. 检查systemd服务文件:")
    out, err, code = run_command(client, "systemctl list-unit-files | grep blog || echo '未找到blog服务'")
    print(out)
    
    # 检查服务文件内容
    print("\n4. 服务文件内容:")
    out, err, code = run_command(client, "cat /etc/systemd/system/blog.service 2>/dev/null || echo '服务文件不存在'")
    print(out)
    
    # 检查日志
    print("\n5. 最近日志:")
    out, err, code = run_command(client, "journalctl -u blog.service --since '1 hour ago' --no-pager -n 10 2>/dev/null || echo '无法获取日志'")
    print(out)
    
    # 检查文件权限
    print("\n6. 文件权限:")
    out, err, code = run_command(client, "ls -la /var/www/blog/backend/")
    print(out)

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        check_deployment_details(client)
    finally:
        client.close()
        print("\n检查完成")

if __name__ == "__main__":
    main()