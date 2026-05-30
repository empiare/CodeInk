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

def test_services(client):
    """测试服务状态"""
    print("=== 测试服务状态 ===")
    
    # 检查Java进程详情
    print("\n1. 检查Java进程详情...")
    out, err, code = run_command(client, "ps aux | grep java | grep -v grep")
    if out.strip():
        print("✅ Java进程运行中:")
        print(out)
    else:
        print("❌ 未找到Java进程")
    
    # 检查端口8080的进程
    print("\n2. 检查端口8080的进程...")
    out, err, code = run_command(client, "lsof -i :8080 2>/dev/null || netstat -tlnp | grep :8080")
    print(out)
    
    # 测试后端API
    print("\n3. 测试后端API...")
    out, err, code = run_command(client, "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/api/articles 2>/dev/null || echo 'API测试失败'")
    print(f"API响应状态码: {out}")
    
    # 测试前端页面
    print("\n4. 测试前端页面...")
    out, err, code = run_command(client, "curl -s -o /dev/null -w '%{http_code}' http://localhost/ 2>/dev/null || echo '前端测试失败'")
    print(f"前端响应状态码: {out}")
    
    # 测试管理后台
    print("\n5. 测试管理后台...")
    out, err, code = run_command(client, "curl -s -o /dev/null -w '%{http_code}' http://localhost/admin/ 2>/dev/null || echo '管理后台测试失败'")
    print(f"管理后台响应状态码: {out}")
    
    # 检查数据库连接
    print("\n6. 检查数据库连接...")
    out, err, code = run_command(client, "mysql -u root -p'990823Zl.' -e 'SELECT 1' 2>/dev/null && echo '数据库连接正常' || echo '数据库连接失败'")
    print(out)
    
    # 检查Redis连接
    print("\n7. 检查Redis连接...")
    out, err, code = run_command(client, "redis-cli ping 2>/dev/null || echo 'Redis未安装或未运行'")
    print(f"Redis响应: {out}")

def main():
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        sys.exit(1)
    
    try:
        test_services(client)
    finally:
        client.close()
        print("\n测试完成")

if __name__ == "__main__":
    main()