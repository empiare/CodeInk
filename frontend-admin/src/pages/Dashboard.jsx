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
      <h1 className="text-2xl font-bold mb-8 text-stone-900 dark:text-stone-100 tracking-tight">仪表盘</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="text-3xl font-bold tabular-nums text-stone-900 dark:text-stone-100">{stats.articles}</div>
          <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">文章数</div>
        </div>
        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="text-3xl font-bold tabular-nums text-stone-900 dark:text-stone-100">{stats.comments}</div>
          <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">评论数</div>
        </div>
        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="text-3xl font-bold tabular-nums text-stone-900 dark:text-stone-100">{stats.views}</div>
          <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">总浏览</div>
        </div>
      </div>
    </div>
  );
}
