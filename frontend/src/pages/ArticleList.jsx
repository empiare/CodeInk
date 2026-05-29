import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useArticles, useCategories, useTags } from '../hooks';
import ArticleItem from '../components/article/ArticleItem';
import TagBadge from '../components/common/TagBadge';
import CategoryBadge from '../components/common/CategoryBadge';
import Pagination from '../components/common/Pagination';
import CustomSelect from '../components/common/CustomSelect';

export default function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [categorySlug, setCategorySlug] = useState(searchParams.get('category') || '');
  const [tagSlug, setTagSlug] = useState(searchParams.get('tag') || '');
  const [page, setPage] = useState(0);

  const activeKeyword = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || '';
  const activeTag = searchParams.get('tag') || '';

  const categories = useCategories();
  const tags = useTags();

  const { content: articles, totalPages, loading } = useArticles({
    page,
    size: 8,
    keyword: activeKeyword || undefined,
    category: activeCategory || undefined,
    tag: activeTag || undefined,
  });

  const isFiltered = activeKeyword || activeCategory || activeTag;

  useEffect(() => {
    setPage(0);
  }, [activeKeyword, activeCategory, activeTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (categorySlug) params.set('category', categorySlug);
    if (tagSlug) params.set('tag', tagSlug);
    setSearchParams(params);
  };

  const handleReset = () => {
    setKeyword('');
    setCategorySlug('');
    setTagSlug('');
    setSearchParams({});
  };

  const selectedCategoryName = categories.find((c) => c.slug === activeCategory)?.name;
  const selectedTagName = tags.find((t) => t.slug === activeTag)?.name;

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-200 tracking-tight my-10 mx-0">全部文章</h1>

      <form onSubmit={handleSearch} className="mb-8 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-sm border border-stone-900/[0.06] dark:border-white/[0.06] rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" />
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              placeholder="搜索文章标题..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <CustomSelect
            placeholder="全部分类"
            value={categorySlug}
            onChange={setCategorySlug}
            options={[
              { value: '', label: '全部分类' },
              ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
            ]}
          />
          <CustomSelect
            placeholder="全部标签"
            value={tagSlug}
            onChange={setTagSlug}
            options={[
              { value: '', label: '全部标签' },
              ...tags.map((tag) => ({ value: tag.slug, label: tag.name })),
            ]}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white rounded-xl shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer border-none"
            >
              搜索
            </button>
            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 text-sm font-medium bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 text-stone-600 dark:text-stone-400 rounded-xl hover:bg-white dark:hover:bg-stone-800/70 hover:shadow-sm transition-all cursor-pointer"
              >
                重置
              </button>
            )}
          </div>
        </div>
      </form>

      {isFiltered && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
          <span>筛选条件：</span>
          {activeKeyword && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs text-stone-600 dark:text-stone-300">
              关键词：{activeKeyword}
            </span>
          )}
          {activeCategory && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs text-stone-600 dark:text-stone-300">
              分类：{selectedCategoryName || activeCategory}
            </span>
          )}
          {activeTag && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs text-stone-600 dark:text-stone-300">
              标签：{selectedTagName || activeTag}
            </span>
          )}
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-[15px]">
          {isFiltered ? '未找到匹配的文章' : '暂无文章'}
        </div>
      )}
      {articles.length > 0 && (
        <div className="flex flex-col">
          {articles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {!isFiltered && (categories.length > 0 || tags.length > 0) && (
        <div className="mt-10 pt-6 border-t border-stone-100 dark:border-stone-900">
          {categories.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3 font-semibold">分类</h3>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <CategoryBadge key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3 font-semibold">标签</h3>
              <div className="flex flex-wrap gap-1.5">
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
