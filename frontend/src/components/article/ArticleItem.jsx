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
    <article className="py-5 border-b border-stone-100 dark:border-stone-900 last:border-none">
      <div className="text-xs text-stone-400 dark:text-stone-500 tabular-nums mb-1">{date}</div>
      <h2 className="text-lg font-medium text-stone-900 dark:text-stone-200 mb-1.5 leading-snug">
        <Link to={`/articles/${article.slug}`} className="text-stone-900 dark:text-stone-200 hover:text-amber-700 dark:hover:text-amber-400 no-underline">{article.title}</Link>
      </h2>
      {article.summary && (
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-2 line-clamp-2">{article.summary}</p>
      )}
      <div className="flex items-center gap-3 flex-wrap">
        {article.category && <CategoryBadge category={article.category} />}
        {article.tags?.map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
      </div>
    </article>
  );
}
