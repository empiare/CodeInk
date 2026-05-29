import { useState, useEffect } from 'react';
import client from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ articles: 0, comments: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/articles?page=0&size=1')
      .then((res) => {
        setStats((prev) => ({
          ...prev,
          articles: res?.totalElements ?? res?.total ?? 0,
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">加载中...</div>;

  return (
    <div>
      <h1 className="admin-page-title">仪表盘</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__value">{stats.articles}</div>
          <div className="stat-card__label">文章数</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.comments}</div>
          <div className="stat-card__label">评论数</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.views}</div>
          <div className="stat-card__label">总浏览</div>
        </div>
      </div>
    </div>
  );
}
