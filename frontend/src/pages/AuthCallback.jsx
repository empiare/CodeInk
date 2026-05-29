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
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-8 px-8">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded p-8 w-full max-w-[400px] shadow-md">
        <p>正在登录中...</p>
      </div>
    </div>
  );
}
