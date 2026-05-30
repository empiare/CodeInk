#!/usr/bin/env python3
import subprocess
import sys

# 服务器信息
HOST = '47.108.68.180'
USER = 'root'
PASS = '990823Zl.'

def run_ssh_command(command):
    """通过SSH执行命令"""
    # 使用sshpass如果可用，否则提示手动输入
    ssh_cmd = ['ssh', '-o', 'StrictHostKeyChecking=no', f'{USER}@{HOST}', command]
    try:
        result = subprocess.run(ssh_cmd, capture_output=True, text=True, timeout=60)
        return result.stdout, result.stderr, result.returncode
    except subprocess.TimeoutExpired:
        return '', 'Command timed out', 1
    except Exception as e:
        return '', str(e), 1

def upload_file(local_path, remote_path):
    """上传文件到服务器"""
    scp_cmd = ['scp', '-o', 'StrictHostKeyChecking=no', local_path, f'{USER}@{HOST}:{remote_path}']
    try:
        result = subprocess.run(scp_cmd, capture_output=True, text=True, timeout=120)
        return result.returncode == 0
    except:
        return False

# 测试连接
print('测试SSH连接...')
stdout, stderr, code = run_ssh_command('echo "连接成功"')
if code == 0:
    print(f'SSH连接正常: {stdout.strip()}')
else:
    print(f'SSH连接失败: {stderr}')
    print('请确保SSH密钥已配置或使用sshpass')
    sys.exit(1)
