#!/usr/bin/env python3
"""
一键部署脚本
自动构建并部署前端到服务器
"""
import paramiko
import os
import sys
import subprocess
from pathlib import Path

HOST = '47.108.68.180'
USER = 'root'
PASS = '990823Zl.'

# 项目配置
PROJECTS = {
    'frontend': {
        'local_path': r'd:\acode\blog\frontend',
        'remote_path': '/var/www/blog/frontend/dist',
        'build_cmd': 'npm run build'
    },
    'frontend-admin': {
        'local_path': r'd:\acode\blog\frontend-admin',
        'remote_path': '/var/www/blog/frontend-admin/dist',
        'build_cmd': 'npm run build'
    }
}

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

def build_project(project_name, config):
    """构建项目"""
    print(f"\n[构建] {project_name}")
    
    local_path = config['local_path']
    dist_path = os.path.join(local_path, 'dist')
    
    # 检查是否需要构建
    if os.path.exists(dist_path) and os.path.exists(os.path.join(dist_path, 'index.html')):
        print(f"  ✅ dist目录已存在，跳过构建")
        return True
    
    # 执行构建
    print(f"  正在构建...")
    try:
        result = subprocess.run(
            config['build_cmd'].split(),
            cwd=local_path,
            capture_output=True,
            text=True,
            timeout=180
        )
        
        if result.returncode == 0:
            print(f"  ✅ 构建成功")
            return True
        else:
            print(f"  ❌ 构建失败:")
            print(result.stderr[-500:] if len(result.stderr) > 500 else result.stderr)
            return False
    except Exception as e:
        print(f"  ❌ 构建异常: {e}")
        return False

def upload_directory(sftp, local_path, remote_path):
    """上传目录"""
    local_path = Path(local_path)
    
    # 创建远程目录
    try:
        sftp.mkdir(remote_path)
    except:
        pass
    
    # 上传文件
    file_count = 0
    for item in local_path.rglob('*'):
        if item.is_file():
            relative_path = item.relative_to(local_path)
            remote_file = f"{remote_path}/{relative_path}".replace('\\', '/')
            
            # 创建目录
            remote_dir = os.path.dirname(remote_file)
            try:
                sftp.mkdir(remote_dir)
            except:
                pass
            
            # 上传文件
            try:
                sftp.put(str(item), remote_file)
                file_count += 1
            except Exception as e:
                print(f"  ❌ 上传失败 {relative_path}: {e}")
                return False
    
    print(f"  ✅ 上传完成，共 {file_count} 个文件")
    return True

def deploy_project(client, project_name, config):
    """部署项目"""
    print(f"\n[部署] {project_name}")
    
    local_dist = os.path.join(config['local_path'], 'dist')
    remote_path = config['remote_path']
    
    if not os.path.exists(local_dist):
        print(f"  ❌ 本地dist目录不存在")
        return False
    
    # 清空远程目录
    run_command(client, f"rm -rf {remote_path}/*")
    
    # 上传文件
    sftp = client.open_sftp()
    try:
        success = upload_directory(sftp, local_dist, remote_path)
        return success
    finally:
        sftp.close()

def main():
    # 解析参数
    target = sys.argv[1] if len(sys.argv) > 1 else 'all'
    
    if target not in ['all', 'frontend', 'admin']:
        print("用法: python quick_deploy.py [all|frontend|admin]")
        print("  all     - 部署前台和后台（默认）")
        print("  frontend - 只部署前台")
        print("  admin   - 只部署后台")
        return
    
    print("=" * 50)
    print("前端一键部署工具")
    print("=" * 50)
    
    # 确定要部署的项目
    if target == 'all':
        projects = ['frontend', 'frontend-admin']
    elif target == 'frontend':
        projects = ['frontend']
    else:
        projects = ['frontend-admin']
    
    # 连接服务器
    print(f"\n连接服务器 {HOST}...")
    client = ssh_connect()
    if not client:
        print("❌ 无法连接服务器")
        return
    
    try:
        success_count = 0
        
        for project_name in projects:
            config = PROJECTS[project_name]
            
            print(f"\n{'='*50}")
            print(f"处理: {project_name}")
            print(f"{'='*50}")
            
            # 构建
            if not build_project(project_name, config):
                continue
            
            # 部署
            if deploy_project(client, project_name, config):
                success_count += 1
        
        # 重启Nginx
        print(f"\n[重启] Nginx")
        run_command(client, "systemctl reload nginx")
        print(f"  ✅ Nginx已重启")
        
        # 结果
        print(f"\n{'='*50}")
        print(f"部署完成！成功: {success_count}/{len(projects)}")
        print(f"{'='*50}")
        
        if success_count > 0:
            print("\n访问地址:")
            if 'frontend' in projects:
                print("  前台: http://47.108.68.180/")
            if 'frontend-admin' in projects:
                print("  后台: http://47.108.68.180/admin/")
        
    finally:
        client.close()

if __name__ == "__main__":
    main()