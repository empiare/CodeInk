#!/usr/bin/env python3
"""
MIME类型错误诊断脚本
检查JavaScript文件的MIME类型配置
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

def check_mime_issue(client):
    """检查MIME类型问题"""
    print("=== MIME类型错误诊断 ===")
    
    # 检查JS文件的响应头
    print("\n1. 检查JS文件MIME类型:")
    out, err, code = run_command(client, "curl -s -I http://localhost/admin/assets/index-COd4M5Mf.js | grep -i 'content-type'")
    print(out)
    
    # 检查Nginx MIME类型配置
    print("\n2. 检查Nginx MIME类型配置:")
    out, err, code = run_command(client, "cat /etc/nginx/mime.types | grep -i 'javascript\\|js' | head -5")
    print(out)
    
    # 检查主配置文件是否包含mime.types
    print("\n3. 检查主配置文件:")
    out, err, code = run_command(client, "cat /etc/nginx/nginx.conf | grep -i 'include\\|mime'")
    print(out)
    
    # 检查JS文件是否真实存在
    print("\n4. 检查JS文件内容:")
    out, err, code = run_command(client, "head -c 200 /var/www/blog/frontend-admin/dist/assets/index-COd4M5Mf.js")
    print(out)
    
    # 检查alias配置是否正确
    print("\n5. 检查alias配置:")
    out, err, code = run_command(client, "curl -s -o /dev/null -w 'HTTP状态码: %{http_code}\n文件大小: %{size_download}\n' http://localhost/admin/assets/index-COd4M5Mf.js")
    print(out)
    
    # 检查是否有其他配置覆盖
    print("\n6. 检查所有Nginx配置:")
    out, err, code = run_command(client, "nginx -T 2>/dev/null | grep -A5 -B5 'admin' | head -30")
    print(out)

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        check_mime_issue(client)
    finally:
        client.close()
        print("\n诊断完成")

if __name__ == "__main__":
    main()