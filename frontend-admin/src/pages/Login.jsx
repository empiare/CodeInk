import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'admin_login_remember';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
      } catch {}
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
      navigate('/');
    } catch (err) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-[380px] px-8 py-8 bg-white/80 dark:bg-stone-900/70 backdrop-blur-xl border border-stone-900/[0.06] dark:border-white/[0.06] rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-stone-900 dark:text-stone-100">
          Code<span className="text-amber-600 dark:text-amber-400">Ink</span>
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 text-center mb-6">管理后台登录</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">邮箱</label>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">密码</label>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex gap-2 mt-5">
            <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
