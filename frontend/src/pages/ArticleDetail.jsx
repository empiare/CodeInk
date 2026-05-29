import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useArticle } from '../hooks';
import MarkdownRenderer from '../components/article/MarkdownRenderer';
import TableOfContents from '../components/article/TableOfContents';
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
    <>
      {article && <TableOfContents content={article.content} />}
      <div className="reading-area lg:ml-[304px]">
        {loading ? (
          <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
        ) : error || !article ? (
          <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-[15px]">文章不存在</div>
        ) : (
          <>
            <article>
              <header className="pt-12 pb-10 mb-10 border-b border-stone-100 dark:border-stone-800/50">
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 mb-8 transition-colors no-underline hover:no-underline"
                >
                  <ArrowLeft size={14} />
                  返回文章列表
                </Link>

                <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-tight tracking-tight mb-5">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                  {date && <time>{date}</time>}
                  {article.category && (
                    <>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <CategoryBadge category={article.category} />
                    </>
                  )}
                  {article.viewCount > 0 && (
                    <>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <span>{article.viewCount} 阅读</span>
                    </>
                  )}
                </div>

                {article.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {article.tags.map(tag => (
                      <TagBadge key={tag.id} tag={tag} />
                    ))}
                  </div>
                )}
              </header>

              <MarkdownRenderer content={article.content} />
            </article>

            <CommentSection articleId={article.id} />
          </>
        )}
      </div>
    </>
  );
}