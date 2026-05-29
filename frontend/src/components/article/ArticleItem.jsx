import { Link } from 'react-router-dom';
import CategoryBadge from '../common/CategoryBadge';
import TagBadge from '../common/TagBadge';

export default function ArticleItem({ article }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  return (
    <article className="article-item">
      <div className="article-item__date">{date}</div>
      <h2 className="article-item__title">
        <Link to={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      {article.summary && (
        <p className="article-item__summary">{article.summary}</p>
      )}
      <div className="article-item__meta">
        {article.category && <CategoryBadge category={article.category} />}
        {article.tags?.map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
      </div>
    </article>
  );
}
