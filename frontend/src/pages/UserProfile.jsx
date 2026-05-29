import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="pt-10 pb-0">
        <div className="flex items-center gap-6 mb-8">
          <div className="user-profile__avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="用户头像" className="w-[100px] h-[100px] rounded-full object-cover" />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-amber-700 dark:bg-amber-500 text-white flex items-center justify-center text-4xl font-bold">
                {user?.displayName?.[0] || user?.username?.[0] || '?'}
              </div>
            )}
          </div>
          <div className="user-profile__info">
            <h1 className="text-2xl mb-2">{user?.displayName || user?.username}</h1>
            <p className="text-stone-600 dark:text-stone-400 text-[15px] mb-1">{user?.email}</p>
            <p className="text-stone-400 dark:text-stone-500 text-sm">
              注册时间：{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
            </p>
          </div>
        </div>

        <div className="flex gap-8 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div className="text-center">
            <span className="block text-2xl font-semibold text-amber-700 dark:text-amber-500 tabular-nums">0</span>
            <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">文章</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-semibold text-amber-700 dark:text-amber-500 tabular-nums">0</span>
            <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">评论</span>
          </div>
        </div>
      </div>
    </div>
  );
}
