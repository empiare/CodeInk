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
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [aiNews, setAiNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/articles?page=0&size=10&sort=publishedAt,desc'),
      client.get('/tags'),
      client.get('/categories'),
      client.get('/stats'),
      client.get('/ai-news/latest?limit=6').catch(() => []),
    ]).then(([articleRes, tagRes, catRes, statsRes, aiNewsRes]) => {
      // client 拦截器已解包 ApiResponse，articleRes 直接是分页数据
      const articlesData = (articleRes?.records || articleRes?.content || [])
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setArticles(articlesData);
      setTags(Array.isArray(tagRes) ? tagRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
      setStats(statsRes || null);
      setAiNews(Array.isArray(aiNewsRes) ? aiNewsRes : []);

      // 查找置顶文章，按时间倒序排列
      const featured = articlesData
        .filter(a => a.featured || a.isFeatured)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setFeaturedArticles(featured);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-[1660px] mx-auto max-md:flex-col">
      <div className="flex max-md:flex-col">
      {stats && (
        <aside className="w-[300px] max-md:w-full shrink-0 flex flex-col gap-2 px-3 py-4 bg-stone-50 dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 order-1 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto">
          {categories.length > 0 && (
            <>
              <div className="px-1 py-2">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">文章分类</span>
              </div>
              {categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="flex items-center justify-between px-3 py-2.5 border border-stone-200 dark:border-stone-800 rounded no-underline text-stone-900 dark:text-stone-200 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 hover:no-underline">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs text-stone-400 dark:text-stone-500 ml-auto mr-1.5">({cat.articleCount ?? 0})</span>
                  <span className="text-xs text-stone-400 dark:text-stone-500">→</span>
                </Link>
              ))}
            </>
          )}
          {tags.length > 0 && (
            <>
              <div className="px-1 py-2">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">标签</span>
              </div>
              <div className="flex flex-wrap gap-1.5 px-1">
                {tags.map((tag) => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
            </>
          )}
        </aside>
      )}

      {featuredArticles.length > 0 && (
        <aside className="w-[300px] max-md:w-full shrink-0 flex flex-col gap-2 px-3 py-4 bg-stone-50 dark:bg-stone-950 border-l border-stone-200 dark:border-stone-800 order-3 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-1 py-2">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">精选文章</span>
          </div>
          {featuredArticles.map((article, index) => (
            <div key={article.id} className="flex items-baseline gap-1.5 px-3 py-2.5 border border-stone-200 dark:border-stone-800 rounded transition-colors border-none">
              <Link to={`/articles/${article.slug}`} className="text-[15px] font-semibold leading-snug text-stone-900 dark:text-stone-200 no-underline hover:text-amber-700 dark:hover:text-amber-400">
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400 mr-2 min-w-[1.2rem]">{index + 1}</span>
                {article.title}
              </Link>
            </div>
          ))}
        </aside>
      )}

      <div className="flex-1 min-w-0 px-6 py-4 order-2">
        {loading ? (
          <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
        ) : (
          <>
            {aiNews.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-200 tracking-tight my-10 mx-0">AI 资讯</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
              {aiNews.map(news => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded p-5 transition-shadow hover:shadow-md block no-underline text-inherit"
                >
                  <span className="inline-block text-xs px-2 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 mb-2">{news.sourceName}</span>
                  <h3 className="text-base font-semibold text-stone-900 dark:text-stone-200 line-clamp-2 mb-2 leading-snug">{news.title}</h3>
                  {news.summary && (
                    <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-3 leading-relaxed">{news.summary}</p>
                  )}
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('zh-CN') : ''}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-200 tracking-tight my-10 mx-0">最近文章</h2>
      {articles.length === 0 ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-[15px]">暂无文章</div>
      ) : (
        <div className="flex flex-col">
          {articles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <Link to="/articles" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border border-stone-200 dark:border-stone-800 rounded cursor-pointer transition-all bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-200 hover:no-underline">查看全部文章</Link>
      </div>
          </>
        )}
      </div>
      </div>
    </main>
  );
}
