import { useState, useEffect } from 'react';
import client from '../api/client';

export default function News() {
  const [aiNews, setAiNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/ai-news/latest?limit=50')
      .then(data => {
        setAiNews(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container"><div className="loading">加载中...</div></div>;
  }

  return (
    <div className="container">
      <section className="page-header">
        <h1 className="page-header__title">AI 资讯</h1>
        <p className="page-header__desc">最新的科技与人工智能新闻</p>
      </section>

      {aiNews.length === 0 ? (
        <div className="empty">暂无资讯</div>
      ) : (
        <div className="ai-news-grid">
          {aiNews.map(news => (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-news-card"
            >
              <span className="ai-news-card__source">{news.sourceName}</span>
              <h3 className="ai-news-card__title">{news.title}</h3>
              {news.summary && (
                <p className="ai-news-card__summary">{news.summary}</p>
              )}
              <span className="ai-news-card__time">
                {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('zh-CN') : ''}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
