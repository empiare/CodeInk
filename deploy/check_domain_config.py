#!/usr/bin/env python3
"""
域名配置检查脚本
检查当前服务器配置和域名状态
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

def check_domain_config(client):
    """检查域名配置状态"""
    print("=== 域名配置检查 ===")
    
    # 检查当前Nginx配置
    print("\n1. 当前Nginx配置:")
    out, err, code = run_command(client, "cat /etc/nginx/conf.d/blog.conf")
    print(out)
    
    # 检查域名解析
    print("\n2. 检查域名解析:")
    out, err, code = run_command(client, "nslookup 47.108.68.180 2>/dev/null || echo 'nslookup未安装'")
    print(out)
    
    # 检查SSL证书
    print("\n3. 检查SSL证书:")
    out, err, code = run_command(client, "ls -la /etc/nginx/ssl/ 2>/dev/null || echo 'SSL目录不存在'")
    print(out)
    
    # 检查已配置的域名
    print("\n4. 已配置的域名:")
    out, err, code = run_command(client, "grep -r 'server_name' /etc/nginx/conf.d/ 2>/dev/null")
    print(out)
    
    # 检查DNS服务
    print("\n5. DNS服务状态:")
    out, err, code = run_command(client, "systemctl is-active named 2>/dev/null || systemctl is-active bind9 2>/dev/null || echo 'DNS服务未运行'")
    print(out)

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        check_domain_config(client)
    finally:
        client.close()
        print("\n检查完成")

if __name__ == "__main__":
    main()