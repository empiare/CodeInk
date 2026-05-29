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

  if (loading) return <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">仪表盘</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mb-8">
        <div className="p-4 border border-stone-200 dark:border-stone-800 rounded">
          <div className="text-2xl font-semibold tabular-nums">{stats.articles}</div>
          <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">文章数</div>
        </div>
        <div className="p-4 border border-stone-200 dark:border-stone-800 rounded">
          <div className="text-2xl font-semibold tabular-nums">{stats.comments}</div>
          <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">评论数</div>
        </div>
        <div className="p-4 border border-stone-200 dark:border-stone-800 rounded">
          <div className="text-2xl font-semibold tabular-nums">{stats.views}</div>
          <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">总浏览</div>
        </div>
      </div>
    </div>
  );
}
