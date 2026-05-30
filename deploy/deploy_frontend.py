#!/usr/bin/env python3
"""
前端部署脚本
用于将本地构建的前端文件部署到ECS服务器
"""
import paramiko
import os
import sys
import subprocess
from pathlib import Path

HOST = '47.108.68.180'
USER = 'root'
PASS = '990823Zl.'

# 本地路径
LOCAL_FRONTEND_DIST = r'd:\acode\blog\frontend\dist'
LOCAL_ADMIN_DIST = r'd:\acode\blog\frontend-admin\dist'

# 远程路径
REMOTE_FRONTEND_DIST = '/var/www/blog/frontend/dist'
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

def build_frontend(project_path, project_name):
    """构建前端项目"""
    print(f"\n=== 构建 {project_name} ===")
    
    if not os.path.exists(project_path):
        print(f"❌ 项目路径不存在: {project_path}")
        return False
    
    # 检查dist目录是否存在
    dist_path = os.path.join(project_path, 'dist')
    if os.path.exists(dist_path):
        print(f"✅ dist目录已存在: {dist_path}")
        return True
    
    # 尝试构建
    print(f"正在构建 {project_name}...")
    try:
        result = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=project_path,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode == 0:
            print(f"✅ {project_name} 构建成功")
            return True
        else:
            print(f"❌ {project_name} 构建失败:")
            print(result.stderr)
            return False
    except subprocess.TimeoutExpired:
        print(f"❌ {project_name} 构建超时")
        return False
    except Exception as e:
        print(f"❌ {project_name} 构建异常: {e}")
        return False

def upload_directory(sftp, local_path, remote_path):
    """上传目录到服务器"""
    local_path = Path(local_path)
    
    # 创建远程目录
    try:
        sftp.mkdir(remote_path)
    except:
        pass
    
    # 上传文件
    for item in local_path.rglob('*'):
        if item.is_file():
            # 计算相对路径
            relative_path = item.relative_to(local_path)
            remote_file_path = f"{remote_path}/{relative_path}".replace('\\', '/')
            
            # 创建远程目录
            remote_dir = os.path.dirname(remote_file_path)
            try:
                sftp.mkdir(remote_dir)
            except:
                pass
            
            # 上传文件
            try:
                sftp.put(str(item), remote_file_path)
                print(f"  ✅ 上传: {relative_path}")
            except Exception as e:
                print(f"  ❌ 上传失败 {relative_path}: {e}")
                return False
    
    return True

def deploy_to_server(client, local_path, remote_path, project_name):
    """部署到服务器"""
    print(f"\n=== 部署 {project_name} ===")
    
    if not os.path.exists(local_path):
        print(f"❌ 本地路径不存在: {local_path}")
        return False
    
    # 备份旧文件
    print("备份旧文件...")
    backup_cmd = f"cp -r {remote_path} {remote_path}_backup_$(date +%Y%m%d_%H%M%S) 2>/dev/null || true"
    run_command(client, backup_cmd)
    
    # 清空远程目录
    print("清空远程目录...")
    run_command(client, f"rm -rf {remote_path}/*")
    
    # 上传新文件
    print("上传新文件...")
    sftp = client.open_sftp()
    try:
        success = upload_directory(sftp, local_path, remote_path)
        if success:
            print(f"✅ {project_name} 部署成功")
        else:
            print(f"❌ {project_name} 部署失败")
        return success
    finally:
        sftp.close()

def restart_nginx(client):
    """重启Nginx"""
    print("\n=== 重启Nginx ===")
    out, err, code = run_command(client, "systemctl reload nginx")
    if code == 0:
        print("✅ Nginx重启成功")
        return True
    else:
        print(f"❌ Nginx重启失败: {err}")
        return False

def verify_deployment(client, remote_path, project_name):
    """验证部署"""
    print(f"\n=== 验证 {project_name} ===")
    
    # 检查文件是否存在
    out, err, code = run_command(client, f"ls -la {remote_path}/index.html 2>/dev/null || echo '文件不存在'")
    if "文件不存在" in out:
        print(f"❌ {project_name} 部署验证失败")
        return False
    
    print(f"✅ {project_name} 部署验证成功")
    return True

def main():
    print("=== 前端部署工具 ===")
    print(f"目标服务器: {HOST}")
    
    # 选择部署目标
    print("\n请选择部署目标:")
    print("1. 前台前端 (frontend)")
    print("2. 后台管理 (frontend-admin)")
    print("3. 全部部署")
    
    choice = input("\n请输入选择 (1/2/3): ").strip()
    
    if choice == '1':
        projects = [('frontend', LOCAL_FRONTEND_DIST, REMOTE_FRONTEND_DIST)]
    elif choice == '2':
        projects = [('frontend-admin', LOCAL_ADMIN_DIST, REMOTE_ADMIN_DIST)]
    elif choice == '3':
        projects = [
            ('frontend', LOCAL_FRONTEND_DIST, REMOTE_FRONTEND_DIST),
            ('frontend-admin', LOCAL_ADMIN_DIST, REMOTE_ADMIN_DIST)
        ]
    else:
        print("无效选择")
        return
    
    # 连接服务器
    print(f"\n连接到服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        print("无法连接到服务器")
        return
    
    try:
        # 部署每个项目
        for project_name, local_path, remote_path in projects:
            print(f"\n{'='*50}")
            print(f"部署 {project_name}")
            print(f"{'='*50}")
            
            # 检查本地dist目录
            if not os.path.exists(local_path):
                print(f"❌ 本地dist目录不存在: {local_path}")
                print(f"请先运行: cd {os.path.dirname(local_path)} && npm run build")
                continue
            
            # 部署到服务器
            success = deploy_to_server(client, local_path, remote_path, project_name)
            
            if success:
                # 验证部署
                verify_deployment(client, remote_path, project_name)
        
        # 重启Nginx
        restart_nginx(client)
        
        print(f"\n{'='*50}")
        print("部署完成！")
        print(f"{'='*50}")
        print("\n访问地址:")
        print("  前台前端: http://47.108.68.180/")
        print("  后台管理: http://47.108.68.180/admin/")
        
    finally:
        client.close()

if __name__ == "__main__":
    main()