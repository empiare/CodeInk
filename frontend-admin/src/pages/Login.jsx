import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      navigate('/');
    } catch (err) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-[320px] px-8 py-8">
        <h1 className="font-serif text-xl font-semibold text-center mb-6">登录</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">邮箱</label>
            <input
              type="email"
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors"
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
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border rounded cursor-pointer transition-all bg-amber-700 dark:bg-amber-500 border-amber-700 dark:border-amber-500 text-white hover:opacity-85 no-underline hover:no-underline w-full" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
