import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const GOOGLE_CLIENT_ID = '977237919357-5p5b7jd865ek42g29ip306phts5jmpi2.apps.googleusercontent.com';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, setUser, isAuthenticated } = useAuth();
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
          text: 'signup_with',
        });
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
    if (!username || !email || !password) {
      setError('请填写所有必填字段');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(username, email, password, displayName || username);
      navigate('/');
    } catch (err) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">注册</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">用户名 *</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">邮箱 *</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
            />
          </div>
          <div className="form-group">
            <label className="form-label">昵称</label>
            <input
              type="text"
              className="form-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="可选，默认使用用户名"
            />
          </div>
          <div className="form-group">
            <label className="form-label">密码 *</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6位）"
            />
          </div>
          <div className="form-group">
            <label className="form-label">确认密码 *</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="btn-group">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </div>
        </form>

        <div className="auth-divider">
          <span>或</span>
        </div>

        <div ref={googleButtonRef} className="google-button-container"></div>

        <div className="auth-card__footer">
          <span>已有账号？</span>
          <Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  );
}
