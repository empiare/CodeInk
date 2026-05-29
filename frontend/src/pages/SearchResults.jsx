import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import ArticleItem from '../components/article/ArticleItem';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);
    client.get(`/search?q=${encodeURIComponent(q)}`)
      .then((res) => setResults(res.data?.content || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="container">
      <h1 className="section-header" style={{ marginTop: '2rem' }}>
        搜索：{q}
      </h1>
      {loading ? (
        <div className="loading">搜索中...</div>
      ) : results.length === 0 ? (
        <div className="empty">未找到相关文章</div>
      ) : (
        <div className="article-list">
          {results.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
