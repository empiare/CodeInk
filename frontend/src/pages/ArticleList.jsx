import { useState } from 'react';
import { useArticles, useCategories, useTags } from '../hooks';
import ArticleItem from '../components/article/ArticleItem';
import TagBadge from '../components/common/TagBadge';
import CategoryBadge from '../components/common/CategoryBadge';
import Pagination from '../components/common/Pagination';

export default function ArticleList() {
  const [page, setPage] = useState(0);
  const { content: articles, totalPages, loading } = useArticles({ page, size: 10 });
  const categories = useCategories();
  const tags = useTags();

  return (
    <div className="container">
      <h1 className="section-header" style={{ marginTop: '2rem' }}>全部文章</h1>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="empty">暂无文章</div>
      ) : (
        <div className="article-list">
          {articles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {(categories.length > 0 || tags.length > 0) && (
        <div className="sidebar">
          {categories.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="sidebar__title">分类</h3>
              <div className="sidebar__tags">
                {categories.map((cat) => (
                  <CategoryBadge key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <h3 className="sidebar__title">标签</h3>
              <div className="sidebar__tags">
                {tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
