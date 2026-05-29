import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import ArticleItem from '../components/article/ArticleItem';
import TagBadge from '../components/common/TagBadge';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/articles?page=0&size=8'),
      client.get('/tags'),
      client.get('/categories'),
      client.get('/stats'),
    ]).then(([articleRes, tagRes, catRes, statsRes]) => {
      // client 拦截器已解包 ApiResponse，articleRes 直接是分页数据
      const articlesData = articleRes?.records || articleRes?.content || [];
      setArticles(articlesData);
      setTags(Array.isArray(tagRes) ? tagRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
      setStats(statsRes || null);

      // 查找置顶文章
      const featured = articlesData.find(a => a.featured || a.isFeatured);
      setFeaturedArticle(featured || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container"><div className="loading">加载中...</div></div>;
  }

  return (
    <div className="container">
      {/* Hero 区域 */}
      <section className="hero">
        <h1 className="hero__title">你好，欢迎来到我的博客</h1>
        <p className="hero__desc">
          这里记录我的技术学习笔记、项目经验和个人思考。
        </p>
      </section>

      {/* 统计数据 */}
      {stats && (
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__value">{stats.articleCount}</div>
            <div className="stat-card__label">篇文章</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.categoryCount}</div>
            <div className="stat-card__label">个分类</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.tagCount}</div>
            <div className="stat-card__label">个标签</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.totalViews}</div>
            <div className="stat-card__label">次阅读</div>
          </div>
        </section>
      )}

      {/* 精选文章 */}
      {featuredArticle && (
        <section className="featured-article">
          <Link to={`/articles/${featuredArticle.slug}`} className="featured-article__link">
            {featuredArticle.coverImage && (
              <img src={featuredArticle.coverImage} alt={featuredArticle.title} className="featured-article__image" />
            )}
            <div className="featured-article__content">
              <span className="featured-article__badge">精选文章</span>
              <h2 className="featured-article__title">{featuredArticle.title}</h2>
              {featuredArticle.summary && (
                <p className="featured-article__summary">{featuredArticle.summary}</p>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* 分类导航 */}
      {categories.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-header">文章分类</h2>
          <div className="category-cards">
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="category-card">
                <div className="category-card__name">{cat.name}</div>
                {cat.description && (
                  <div className="category-card__desc">{cat.description}</div>
                )}
                <div className="category-card__count">查看文章 →</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 最近文章 */}
      <h2 className="section-header">最近文章</h2>
      {articles.length === 0 ? (
        <div className="empty">暂无文章</div>
      ) : (
        <div className="article-list">
          {articles.filter(a => !(a.featured || a.isFeatured)).map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link to="/articles" className="btn">查看全部文章</Link>
      </div>

      {/* 标签 */}
      {tags.length > 0 && (
        <div className="sidebar" style={{ marginTop: '2.5rem' }}>
          <h3 className="sidebar__title">标签</h3>
          <div className="sidebar__tags">
            {tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
