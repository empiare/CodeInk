import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useArticles } from '../hooks';
import ArticleItem from '../components/article/ArticleItem';
import Pagination from '../components/common/Pagination';

export default function CategoryPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(0);
  const { content: articles, totalPages, loading } = useArticles({ page, size: 10, category: slug });

  return (
    <div className="container">
      <h1 className="section-header" style={{ marginTop: '2rem' }}>分类：{slug}</h1>
      {loading ? (
        <div className="loading">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="empty">该分类下暂无文章</div>
      ) : (
        <div className="article-list">
          {articles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
