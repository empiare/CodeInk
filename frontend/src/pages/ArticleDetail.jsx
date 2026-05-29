import { useParams } from 'react-router-dom';
import { useArticle } from '../hooks';
import MarkdownRenderer from '../components/article/MarkdownRenderer';
import CategoryBadge from '../components/common/CategoryBadge';
import TagBadge from '../components/common/TagBadge';
import CommentSection from '../components/comment/CommentSection';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { article, loading, error } = useArticle(slug);

  if (loading) return <div className="container"><div className="loading">加载中...</div></div>;
  if (error || !article) return <div className="container"><div className="empty">文章不存在</div></div>;

  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="container container--narrow">
      <article>
        <header className="article-header">
          <h1 className="article-header__title">{article.title}</h1>
          <div className="article-header__meta">
            {date && <span>{date}</span>}
            {article.category && <CategoryBadge category={article.category} />}
            {article.tags?.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
            {article.viewCount > 0 && (
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                {article.viewCount} 阅读
              </span>
            )}
          </div>
        </header>

        <MarkdownRenderer content={article.content} />
      </article>

      <CommentSection articleId={article.id} />
    </div>
  );
}
