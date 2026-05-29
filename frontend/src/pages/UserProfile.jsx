import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container container--narrow">
      <div className="user-profile">
        <div className="user-profile__header">
          <div className="user-profile__avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="用户头像" />
            ) : (
              <div className="avatar-placeholder">
                {user?.displayName?.[0] || user?.username?.[0] || '?'}
              </div>
            )}
          </div>
          <div className="user-profile__info">
            <h1>{user?.displayName || user?.username}</h1>
            <p className="user-profile__email">{user?.email}</p>
            <p className="user-profile__joined">
              注册时间：{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
            </p>
          </div>
        </div>

        <div className="user-profile__stats">
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">文章</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">评论</span>
          </div>
        </div>
      </div>
    </div>
  );
}
