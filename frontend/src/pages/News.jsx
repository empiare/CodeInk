import { useState, useEffect } from 'react';
import client from '../api/client';
import Pagination from '../components/common/Pagination';

export default function News() {
  const [aiNews, setAiNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    client.get(`/ai-news?page=${page}&size=9`)
      .then(data => {
        setAiNews(data.content || []);
        setTotalPages(data.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <section className="pt-12 pb-8 border-b border-stone-100 dark:border-stone-900 mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-200 mb-2 tracking-tight">AI 资讯</h1>
        <p className="text-stone-600 dark:text-stone-400 text-base">最新的科技与人工智能新闻</p>
      </section>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : aiNews.length === 0 ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-[15px]">暂无资讯</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
          {aiNews.map(news => (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded p-5 transition-shadow hover:shadow-md block no-underline text-inherit"
            >
              <span className="inline-block text-xs px-2 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 mb-2">{news.sourceName}</span>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-200 line-clamp-2 mb-2 leading-snug">{news.title}</h3>
              {news.summary && (
                <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-3 leading-relaxed">{news.summary}</p>
              )}
              <span className="text-xs text-stone-400 dark:text-stone-500">
                {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('zh-CN') : ''}
              </span>
            </a>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
