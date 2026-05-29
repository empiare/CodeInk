import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import TagBadge from '../common/TagBadge';

export default function ArticleItem({ article }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  return (
    <article className="group py-5 border-b border-stone-100/80 dark:border-stone-800/50 last:border-none transition-colors">
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 leading-snug tracking-tight">
        <Link
          to={`/articles/${article.slug}`}
          className="text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 no-underline transition-colors duration-200"
        >
          {article.title}
        </Link>
      </h2>
      {article.summary && (
        <p className="text-[15px] text-stone-500 dark:text-stone-400 leading-relaxed mb-3 line-clamp-2">
          {article.summary}
        </p>
      )}
      <div className="flex items-center gap-3 flex-wrap">
        {article.category && <CategoryBadge category={article.category} />}
        {article.tags?.slice(0, 3).map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
        {article.tags?.length > 3 && (
          <span className="text-xs text-stone-400">+{article.tags.length - 3}</span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-stone-400 dark:text-stone-500 tabular-nums">{date}</span>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span className="text-xs text-stone-400 dark:text-stone-500">{article.viewCount ?? 0}</span>
          <Eye size={12} className="text-stone-400 dark:text-stone-500" />
        </div>
      </div>
    </article>
  );
}
