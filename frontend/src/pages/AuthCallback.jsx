import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userName = searchParams.get('user');
    const avatar = searchParams.get('avatar');

    if (token) {
      localStorage.setItem('token', token);

      const userInfo = {
        displayName: userName,
        avatarUrl: avatar || null
      };
      setUser(userInfo);

      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p>正在登录中...</p>
      </div>
    </div>
  );
}
