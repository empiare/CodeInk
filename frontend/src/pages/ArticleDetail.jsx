import { useParams } from 'react-router-dom';
import { useArticle } from '../hooks';
import MarkdownRenderer from '../components/article/MarkdownRenderer';
import CategoryBadge from '../components/common/CategoryBadge';
import TagBadge from '../components/common/TagBadge';
import CommentSection from '../components/comment/CommentSection';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { article, loading, error } = useArticle(slug);

  const date = article?.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="max-w-3xl mx-auto px-6">
      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : error || !article ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-[15px]">文章不存在</div>
      ) : (
        <>
          <article>
            <header className="py-10 border-b border-stone-200 dark:border-stone-800 mb-8">
              <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-200 leading-snug tracking-tight mb-3">{article.title}</h1>
              <div className="flex items-center gap-3 text-stone-400 dark:text-stone-500 text-xs">
                {date && <span>{date}</span>}
                {article.category && <CategoryBadge category={article.category} />}
                {article.tags?.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
                {article.viewCount > 0 && (
                  <span className="text-stone-400 dark:text-stone-500 text-xs">
                    {article.viewCount} 阅读
                  </span>
                )}
              </div>
            </header>

            <MarkdownRenderer content={article.content} />
          </article>

          <CommentSection articleId={article.id} />
        </>
      )}
    </div>
  );
}
