import { useState, useEffect, useRef } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Camera, Save, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarMeta, setAvatarMeta] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        displayName: user.displayName || '',
        email: user.email || '',
      });
      if (user.avatarUrl) {
        setAvatarPreview(user.avatarUrl);
      }
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      showMessage('error', '用户名不能为空');
      return;
    }
    setLoading(true);
    try {
      await client.put('/profile', {
        username: formData.username,
        displayName: formData.displayName,
      });
      showMessage('success', '个人信息更新成功');
      updateUser({ ...user, ...formData });
    } catch (err) {
      showMessage('error', err.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      showMessage('error', '请填写完整密码信息');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', '两次输入的新密码不一致');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showMessage('error', '新密码长度不能少于6位');
      return;
    }
    setLoading(true);
    try {
      await client.post('/profile/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      showMessage('success', '密码修改成功');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showMessage('error', err.message || '密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('error', '请选择图片文件');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', '图片大小不能超过5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
      setAvatarMeta({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString('zh-CN'),
      });
    };
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await client.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.avatarUrl) {
        await client.put('/profile', { avatarUrl: res.avatarUrl });
        updateUser({ ...user, avatarUrl: res.avatarUrl });
        showMessage('success', '头像上传成功');
      }
    } catch (err) {
      showMessage('error', err.message || '头像上传失败');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'info', label: '基本信息', icon: User },
    { id: 'password', label: '修改密码', icon: Lock },
    { id: 'avatar', label: '头像设置', icon: Camera },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-8">个人中心</h1>

      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-500/20'
            : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-2 mb-8 border-b border-stone-200/50 dark:border-stone-800/50 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer border-none ${
                activeTab === tab.id
                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'bg-transparent text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'info' && (
        <form onSubmit={handleInfoSubmit} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">用户名</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              placeholder="请输入用户名"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">昵称</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              placeholder="请输入昵称"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">邮箱</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-500 dark:text-stone-400 outline-none cursor-not-allowed"
            />
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">邮箱不可修改</p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              保存修改
            </button>
          </div>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">原密码</label>
            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              placeholder="请输入原密码"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">新密码</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              placeholder="请输入新密码（至少6位）"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">确认新密码</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              placeholder="请再次输入新密码"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              修改密码
            </button>
          </div>
        </form>
      )}

      {activeTab === 'avatar' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="头像预览"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user?.displayName?.[0] || user?.username?.[0] || '?'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/70 dark:border-stone-700/50 rounded-xl cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              选择新头像
            </button>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">支持 JPG、PNG 格式，最大 5MB</p>
          </div>

          {avatarMeta && (
            <div className="mt-6 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">头像信息</h3>
              <div className="space-y-2 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>文件名</span>
                  <span className="text-stone-700 dark:text-stone-300">{avatarMeta.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>文件大小</span>
                  <span className="text-stone-700 dark:text-stone-300">{avatarMeta.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>文件类型</span>
                  <span className="text-stone-700 dark:text-stone-300">{avatarMeta.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>上传时间</span>
                  <span className="text-stone-700 dark:text-stone-300">{avatarMeta.lastModified}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
