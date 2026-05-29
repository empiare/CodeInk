import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import client from '../api/client';
import { useCategories, useTags } from '../hooks';
import ArticleItem from '../components/article/ArticleItem';
import Pagination from '../components/common/Pagination';
import CustomSelect from '../components/common/CustomSelect';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category') || '';
  const tagSlug = searchParams.get('tag') || '';

  const [keyword, setKeyword] = useState(q);
  const [category, setCategory] = useState(categorySlug);
  const [tag, setTag] = useState(tagSlug);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const categories = useCategories();
  const tags = useTags();

  const isFiltered = q || categorySlug || tagSlug;

  useEffect(() => {
    setKeyword(q);
    setCategory(categorySlug);
    setTag(tagSlug);
    setPage(0);
  }, [q, categorySlug, tagSlug]);

  useEffect(() => {
    if (!isFiltered) return;
    setLoading(true);

    const params = new URLSearchParams({ page, size: 10 });
    if (q) params.set('q', q);
    if (categorySlug) params.set('category', categorySlug);
    if (tagSlug) params.set('tag', tagSlug);

    client.get(`/search/advanced?${params.toString()}`)
      .then((res) => {
        setResults(res.content || res.records || []);
        setTotalPages(res.totalPages ?? res.pages ?? 0);
      })
      .catch(() => {
        setResults([]);
        setTotalPages(0);
      })
      .finally(() => setLoading(false));
  }, [q, categorySlug, tagSlug, page, isFiltered]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (category) params.set('category', category);
    if (tag) params.set('tag', tag);
    setSearchParams(params);
  };

  const selectedCategoryName = categories.find((c) => c.slug === categorySlug)?.name;
  const selectedTagName = tags.find((t) => t.slug === tagSlug)?.name;

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-200 tracking-tight my-10 mx-0">搜索文章</h1>

      <form onSubmit={handleSearch} className="mb-8 p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" />
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors placeholder:text-stone-400 dark:placeholder:text-stone-500"
              placeholder="搜索文章标题..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <CustomSelect
            placeholder="全部分类"
            value={category}
            onChange={setCategory}
            options={[
              { value: '', label: '全部分类' },
              ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
            ]}
          />
          <CustomSelect
            placeholder="全部标签"
            value={tag}
            onChange={setTag}
            options={[
              { value: '', label: '全部标签' },
              ...tags.map((t) => ({ value: t.slug, label: t.name })),
            ]}
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-amber-700 dark:bg-amber-500 text-white rounded hover:bg-amber-800 dark:hover:bg-amber-600 transition-colors cursor-pointer border-none"
          >
            搜索
          </button>
        </div>
      </form>

      {isFiltered && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
          <span>筛选条件：</span>
          {q && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs text-stone-600 dark:text-stone-300">
              关键词：{q}
            </span>
          )}
          {categorySlug && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs text-stone-600 dark:text-stone-300">
              分类：{selectedCategoryName || categorySlug}
            </span>
          )}
          {tagSlug && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs text-stone-600 dark:text-stone-300">
              标签：{selectedTagName || tagSlug}
            </span>
          )}
        </div>
      )}

      {!isFiltered && (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-[15px]">请输入关键词或选择筛选条件进行搜索</div>
      )}

      {isFiltered && !loading && results.length === 0 && (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-[15px]">未找到相关文章</div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col">
          {results.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
