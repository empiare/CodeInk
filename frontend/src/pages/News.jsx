import { useState, useEffect, useRef } from 'react';
import { Calendar, Filter, X, Check } from 'lucide-react';
import client from '../api/client';
import Pagination from '../components/common/Pagination';

export default function News() {
  const [aiNews, setAiNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    client.get('/ai-news/sources')
      .then(data => setSources(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSourceDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams({ page, size: '9' });
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (selectedSources.length > 0) params.set('sourceKeys', selectedSources.join(','));

    const fetchData = () => {
      setLoading(true);
      client.get(`/ai-news?${params.toString()}`)
        .then(data => {
          if (!cancelled) {
            setAiNews(data.content || []);
            setTotalPages(data.totalPages || 0);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    const tid = setTimeout(fetchData, 0);
    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [page, startDate, endDate, searchTrigger]);

  const handleSearch = () => {
    setPage(0);
    setSearchTrigger(t => t + 1);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setSelectedSources([]);
    setPage(0);
  };

  const toggleSource = (sourceKey) => {
    setSelectedSources(prev =>
      prev.includes(sourceKey)
        ? prev.filter(k => k !== sourceKey)
        : [...prev, sourceKey]
    );
  };

  const hasTimeFilter = startDate || endDate;
  const hasSourceFilter = selectedSources.length > 0;

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      <section className="pt-12 pb-8 border-b border-stone-100 dark:border-stone-900 mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-200 mb-2 tracking-tight">AI 资讯</h1>
        <p className="text-stone-600 dark:text-stone-400 text-base">最新的科技与人工智能新闻</p>
      </section>

      <div className="mb-8 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-sm rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="开始日期"
                className="w-40 pl-9 pr-3 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
            <span className="text-stone-300 dark:text-stone-600">&mdash;</span>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="结束日期"
                className="w-40 pl-9 pr-3 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowSourceDropdown(!showSourceDropdown)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                hasSourceFilter
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300/50 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
                  : 'bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border-stone-200/70 dark:border-stone-700/50 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'
              }`}
            >
              <Filter size={14} />
              <span>资讯源{hasSourceFilter ? ` (${selectedSources.length})` : ''}</span>
            </button>

            {showSourceDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-700/50 rounded-xl shadow-lg z-50 p-2">
                {sources.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-stone-500 px-2 py-3 text-center">暂无数据源</p>
                ) : (
                  sources.map(source => (
                    <div
                      key={source.sourceKey}
                      onClick={() => toggleSource(source.sourceKey)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-sm"
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedSources.includes(source.sourceKey)
                          ? 'bg-amber-600 border-amber-600 dark:bg-amber-500 dark:border-amber-500'
                          : 'border-stone-300 dark:border-stone-600'
                      }`}>
                        {selectedSources.includes(source.sourceKey) && (
                          <Check size={10} className="text-white" strokeWidth={3} />
                        )}
                      </div>
                      <span className="text-stone-700 dark:text-stone-300 truncate">{source.sourceName}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white rounded-xl shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer border-none"
            >
              搜索
            </button>
            {(hasTimeFilter || hasSourceFilter) && (
              <button
                onClick={handleClear}
                className="px-5 py-2.5 text-sm font-medium bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 text-stone-600 dark:text-stone-400 rounded-xl hover:bg-white dark:hover:bg-stone-800/70 hover:shadow-sm transition-all cursor-pointer"
              >
                重置
              </button>
            )}
          </div>
        </div>
      </div>

      {(hasTimeFilter || hasSourceFilter) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
          <span>筛选条件：</span>
          {hasTimeFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs text-stone-600 dark:text-stone-300">
              <Calendar size={11} />
              {startDate ? formatDisplayDate(startDate) : '最早'}
              {' \u2014 '}
              {endDate ? formatDisplayDate(endDate) : '至今'}
            </span>
          )}
          {hasSourceFilter && selectedSources.map(key => {
            const source = sources.find(s => s.sourceKey === key);
            return (
              <span key={key} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-xs text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                {source ? source.sourceName : key}
                <button
                  onClick={() => toggleSource(key)}
                  className="ml-0.5 hover:text-amber-900 dark:hover:text-amber-300 cursor-pointer"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : aiNews.length === 0 ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-[15px]">
          {(hasTimeFilter || hasSourceFilter) ? '该筛选条件下暂无资讯' : '暂无资讯'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
          {aiNews.map(news => (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-white dark:bg-stone-900 border border-stone-900/[0.06] dark:border-white/[0.06] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 no-underline text-inherit"
            >
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20 mb-3 self-start">{news.sourceName}</span>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 mb-2 leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{news.title}</h3>
              {news.summary && (
                <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-3 mb-4 leading-relaxed">{news.summary}</p>
              )}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800/50 mt-auto">
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  {news.publishedAt ? new Date(news.publishedAt).toLocaleString('zh-CN') : ''}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
