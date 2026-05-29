import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const GOOGLE_CLIENT_ID = '977237919357-5p5b7jd865ek42g29ip306phts5jmpi2.apps.googleusercontent.com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const { login, setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const callbackRef = useRef(null);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      const data = await client.post('/auth/google', { idToken: response.credential });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google 登录失败');
    }
  }, [setUser, navigate]);

  useEffect(() => {
    callbackRef.current = handleGoogleResponse;
  }, [handleGoogleResponse]);

  const initGoogleButton = useCallback(() => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => callbackRef.current?.(response),
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
        });
        setGoogleReady(true);
      } catch (err) {
        console.error('Google init error:', err);
      }
    }
  }, []);

  const loadGoogleScript = useCallback(() => {
    if (window.google) {
      initGoogleButton();
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', initGoogleButton);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogleButton;
    script.onerror = () => console.error('Failed to load Google script');
    document.head.appendChild(script);
  }, [initGoogleButton]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadGoogleScript();
    }, 500);
    return () => clearTimeout(timer);
  }, [loadGoogleScript]);

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
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-8 px-8">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded p-8 w-full max-w-[400px] shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">登录</h1>
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
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border rounded cursor-pointer transition-all bg-amber-700 dark:bg-amber-500 border-amber-700 dark:border-amber-500 text-white hover:opacity-85 w-full"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>

        <div className="flex items-center my-6 text-stone-400 dark:text-stone-500 text-sm">
          <span className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          <span className="px-4">或</span>
          <span className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
        </div>

        <div ref={googleButtonRef} className="flex justify-center my-2"></div>

        <div className="text-center mt-4 text-sm text-stone-600 dark:text-stone-400">
          <span>还没有账号？</span>
          <Link to="/register">立即注册</Link>
        </div>
      </div>
    </div>
  );
}
