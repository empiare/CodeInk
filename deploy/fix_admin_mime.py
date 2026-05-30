#!/usr/bin/env python3
"""
修复后台管理MIME类型错误
手动构建并部署frontend-admin
"""
import paramiko
import subprocess
import os
import sys

HOST = '47.108.68.180'
USER = 'root'
PASS = '990823Zl.'

LOCAL_ADMIN_PATH = r'd:\acode\blog\frontend-admin'
REMOTE_ADMIN_DIST = '/var/www/blog/frontend-admin/dist'

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

def build_admin():
    """重新构建后台管理项目"""
    print("=== 重新构建后台管理项目 ===")
    
    # 删除旧的dist目录
    dist_path = os.path.join(LOCAL_ADMIN_PATH, 'dist')
    if os.path.exists(dist_path):
        print("删除旧的dist目录...")
        import shutil
        shutil.rmtree(dist_path)
    
    # 使用cmd运行npm
    print("正在构建...")
    try:
        result = subprocess.run(
            'npm run build',
            cwd=LOCAL_ADMIN_PATH,
            capture_output=True,
            text=True,
            timeout=180,
            shell=True
        )
        
        if result.returncode == 0:
            print("✅ 构建成功")
            return True
        else:
            print(f"❌ 构建失败:")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ 构建异常: {e}")
        return False

def upload_admin(client):
    """上传后台管理文件"""
    print("\n=== 上传后台管理文件 ===")
    
    local_dist = os.path.join(LOCAL_ADMIN_PATH, 'dist')
    if not os.path.exists(local_dist):
        print(f"❌ 本地dist目录不存在: {local_dist}")
        return False
    
    # 清空远程目录
    print("清空远程目录...")
    run_command(client, f"rm -rf {REMOTE_ADMIN_DIST}/*")
    
    # 上传文件
    print("上传文件...")
    sftp = client.open_sftp()
    
    try:
        file_count = 0
        for root, dirs, files in os.walk(local_dist):
            for file in files:
                local_file = os.path.join(root, file)
                relative_path = os.path.relpath(local_file, local_dist)
                remote_file = f"{REMOTE_ADMIN_DIST}/{relative_path}".replace('\\', '/')
                
                # 创建远程目录
                remote_dir = os.path.dirname(remote_file)
                try:
                    sftp.mkdir(remote_dir)
                except:
                    pass
                
                # 上传文件
                sftp.put(local_file, remote_file)
                file_count += 1
                print(f"  ✅ {relative_path}")
        
        print(f"\n✅ 上传完成，共 {file_count} 个文件")
        return True
    except Exception as e:
        print(f"❌ 上传失败: {e}")
        return False
    finally:
        sftp.close()

def verify_fix(client):
    """验证修复"""
    print("\n=== 验证修复 ===")
    
    # 检查index.html中的路径
    print("1. 检查index.html中的路径:")
    out, err, code = run_command(client, f"cat {REMOTE_ADMIN_DIST}/index.html")
    print(out)
    
    # 测试JS文件访问
    print("\n2. 测试JS文件访问:")
    out, err, code = run_command(client, "curl -s -I http://localhost/admin/assets/index-COd4M5Mf.js | grep -i 'content-type'")
    print(out)

def main():
    print("=== 修复后台管理MIME类型错误 ===\n")
    
    # 检查是否需要手动构建
    dist_path = os.path.join(LOCAL_ADMIN_PATH, 'dist')
    if not os.path.exists(dist_path):
        print("❌ dist目录不存在，请先手动构建:")
        print(f"   cd {LOCAL_ADMIN_PATH}")
        print("   npm run build")
        print("\n构建完成后，重新运行此脚本")
        return
    
    # 连接服务器
    print(f"连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        print("❌ 无法连接服务器")
        return
    
    try:
        # 上传文件
        if not upload_admin(client):
            print("\n❌ 上传失败")
            return
        
        # 重启Nginx
        print("\n重启Nginx...")
        run_command(client, "systemctl reload nginx")
        print("✅ Nginx已重启")
        
        # 验证修复
        verify_fix(client)
        
        print("\n" + "="*50)
        print("修复完成！")
        print("="*50)
        print("\n请清除浏览器缓存后访问: http://47.108.68.180/admin/")
        print("提示: 按 Ctrl+Shift+R 强制刷新页面")
        
    finally:
        client.close()

if __name__ == "__main__":
    main()