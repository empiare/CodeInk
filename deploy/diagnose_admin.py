#!/usr/bin/env python3
"""
快速诊断脚本
检查后台管理无法访问的问题
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

def diagnose_admin_issue(client):
    """诊断后台管理访问问题"""
    print("=== 后台管理访问问题诊断 ===")
    
    # 检查Nginx配置
    print("\n1. 当前Nginx配置:")
    out, err, code = run_command(client, "cat /etc/nginx/conf.d/blog.conf")
    print(out)
    
    # 检查Nginx语法
    print("\n2. Nginx配置语法检查:")
    out, err, code = run_command(client, "nginx -t 2>&1")
    print(out)
    
    # 检查Nginx状态
    print("\n3. Nginx服务状态:")
    out, err, code = run_command(client, "systemctl status nginx | head -10")
    print(out)
    
    # 检查后台管理文件
    print("\n4. 后台管理文件检查:")
    out, err, code = run_command(client, "ls -la /var/www/blog/frontend-admin/dist/ 2>/dev/null || echo '目录不存在'")
    print(out)
    
    # 测试后台管理访问
    print("\n5. 测试后台管理访问:")
    out, err, code = run_command(client, "curl -s -o /dev/null -w 'HTTP状态码: %{http_code}\n' http://localhost/admin/")
    print(out)
    
    # 检查错误日志
    print("\n6. Nginx错误日志:")
    out, err, code = run_command(client, "tail -20 /var/log/nginx/error.log 2>/dev/null | grep -i 'admin\\|error' || echo '无相关错误日志'")
    print(out)
    
    # 检查备份配置
    print("\n7. 备份配置文件:")
    out, err, code = run_command(client, "ls -la /etc/nginx/conf.d/blog.conf* 2>/dev/null")
    print(out)

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        diagnose_admin_issue(client)
    finally:
        client.close()
        print("\n诊断完成")

if __name__ == "__main__":
    main()