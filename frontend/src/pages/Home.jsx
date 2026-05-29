import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    Promise.all([
      client.get('/articles?page=0&size=8&sort=publishedAt,desc'),
      client.get('/tags'),
      client.get('/categories'),
      client.get('/stats'),
      client.get('/ai-news/latest?limit=6').catch(() => []),
    ]).then(([articleRes, tagRes, catRes, statsRes, aiNewsRes]) => {
      const articlesData = (articleRes?.records || articleRes?.content || [])
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setArticles(articlesData);
      setTags(Array.isArray(tagRes) ? tagRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
      setStats(statsRes || null);
      setAiNews(Array.isArray(aiNewsRes) ? aiNewsRes : []);

      const featured = articlesData
        .filter(a => a.featured || a.isFeatured)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setFeaturedArticles(featured);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setSearching(true);
      client.get(`/search?q=${encodeURIComponent(searchQuery.trim())}&size=10`)
        .then((res) => {
          setSearchResults(res.records || res.content || []);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="flex max-md:flex-col gap-6 max-w-[1660px] mx-auto">
      {stats && (
        <>
        <div className="max-md:hidden w-[280px] flex-shrink-0" />
        <aside className="max-md:hidden fixed top-[4.5rem] left-8 z-40 w-[280px] flex flex-col gap-2 px-4 py-6 bg-white/60 dark:bg-stone-900/50 backdrop-blur-xl border-r border-stone-900/[0.06] dark:border-white/[0.04] rounded-2xl h-[calc(100vh-5rem)] overflow-y-auto">
            {categories.length > 0 && (
              <>
                <div className="px-1 py-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                    文章分类
                  </span>
                </div>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-white/[0.03] transition-all duration-200 no-underline text-stone-900 dark:text-stone-100 text-xs hover:text-stone-900 dark:hover:text-stone-100 hover:no-underline"
                  >
                    <span className="font-medium">{cat.name}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs text-stone-400 dark:text-stone-600 tabular-nums">
                        {cat.articleCount ?? 0}
                      </span>
                      <ArrowRight size={12} className="text-stone-300 dark:text-stone-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                    </span>
                  </Link>
                ))}
              </>
            )}
            {tags.length > 0 && (
              <>
                <div className="px-1 py-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                    标签
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {tags.map((tag) => (
                    <TagBadge key={tag.id} tag={tag} />
                  ))}
                </div>
              </>
            )}
            {featuredArticles.length > 0 && (
              <>
                <div className="px-1 py-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                    精选文章
                  </span>
                </div>
                {featuredArticles.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.slug}`}
                    className="group flex items-baseline gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-white/[0.03] transition-all duration-200 no-underline hover:no-underline text-stone-900 dark:text-stone-100"
                  >
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 min-w-[1.5rem]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium leading-snug text-stone-900 dark:text-stone-100 transition-colors">
                      {article.title}
                    </span>
                  </Link>
                ))}
              </>
            )}
        </aside>
        </>
      )}

      <main className="flex-1 min-w-0 px-8 py-6">
          <div className="relative mb-10">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章标题、内容、标签、分类..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500 dark:focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
            />
          </div>

          {searchQuery.trim() ? (
            <>
              {searching ? (
                <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-sm">搜索中...</div>
              ) : (
                <>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
                    找到 {searchResults.length} 篇相关文章
                  </p>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-[15px]">
                      未找到匹配的文章
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {searchResults.map((article) => (
                        <ArticleItem key={article.id} article={article} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          ) : loading ? (
            <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
          ) : (
            <>
              <h2 className="relative inline-block text-lg font-semibold text-stone-900 dark:text-stone-200 tracking-tight my-10 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-0.5 after:bg-amber-500 after:rounded-full">
                最近文章
              </h2>

              {articles.length === 0 ? (
                <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-[15px]">暂无文章</div>
              ) : (
                <div className="flex flex-col">
                  {articles.map((article) => (
                    <ArticleItem key={article.id} article={article} />
                  ))}
                </div>
              )}

              <div className="text-center mt-10">
                <Link
                  to="/articles"
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 text-sm bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl cursor-pointer transition-all text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800/70 hover:shadow-sm hover:no-underline"
                >
                  查看全部文章
                </Link>
              </div>
            </>
          )}
      </main>

      {aiNews.length > 0 && (
        <>
        <div className="max-md:hidden w-[320px] flex-shrink-0" style={{ transform: 'scaleY(-1)' }} />
        <aside className="max-md:hidden fixed top-[4.5rem] right-8 z-40 w-[320px] flex flex-col gap-2 px-4 py-6 bg-white dark:bg-stone-900 border-l border-stone-900/[0.06] dark:border-white/[0.04] rounded-2xl h-[calc(100vh-5rem)] overflow-y-auto" style={{ willChange: 'transform' }}>
            <div className="px-1 py-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
                AI 资讯
              </span>
            </div>
            {aiNews.map(news => (
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5 px-3 py-3 rounded-xl hover:bg-stone-50 dark:hover:bg-white/[0.03] transition-all duration-200 no-underline text-inherit"
              >
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 self-start">
                  {news.sourceName}
                </span>
                <span className="text-[13px] font-medium leading-snug text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors line-clamp-2">
                  {news.title}
                </span>
                <span className="text-[11px] text-stone-400 dark:text-stone-500">
                  {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('zh-CN') : ''}
                </span>
              </a>
            ))}
        </aside>
        </>
      )}
    </div>
  );
}
