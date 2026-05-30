import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, EyeOff, Search, RotateCcw } from 'lucide-react';
import client from '../api/client';
import Pagination from '../components/common/Pagination';

export default function AiNewsManager() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSources, setSelectedSources] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);

  // 加载来源列表
  useEffect(() => {
    client.get('/ai-news/sources')
      .then((res) => setSources(res || []))
      .catch(() => {});
  }, []);

  // 加载资讯列表
  const fetchNews = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      size: '15',
      showDeleted: showDeleted.toString()
    });

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (selectedSources.length > 0) params.append('sourceKeys', selectedSources.join(','));

    client.get(`/admin/ai-news?${params.toString()}`)
      .then((res) => {
        setNews(res?.content || []);
        setTotalPages(res?.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, [page, searchTrigger]);

  // 搜索
  const handleSearch = () => {
    setPage(0);
    setSearchTrigger(prev => prev + 1);
  };

  // 重置筛选
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedSources([]);
    setShowDeleted(false);
    setPage(0);
    setSearchTrigger(prev => prev + 1);
  };

  // 切换来源选择
  const toggleSource = (sourceKey) => {
    setSelectedSources(prev =>
      prev.includes(sourceKey)
        ? prev.filter(key => key !== sourceKey)
        : [...prev, sourceKey]
    );
  };

  // 删除资讯
  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这条资讯吗？')) return;
    try {
      await client.delete(`/admin/ai-news/${id}`);
      fetchNews();
    } catch {
      alert('删除失败');
    }
  };

  // 切换显示/隐藏
  const handleToggleVisibility = async (id) => {
    try {
      await client.put(`/admin/ai-news/${id}/visibility`);
      fetchNews();
    } catch {
      alert('操作失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-0 text-stone-900 dark:text-stone-100 tracking-tight">资讯管理</h1>
        <span className="text-sm text-stone-500 dark:text-stone-400">
          共 {totalPages > 0 ? totalPages * 15 : 0} 条
        </span>
      </div>

      {/* 筛选工具栏 */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* 时间范围 */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-stone-600 dark:text-stone-400">时间范围：</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-stone-400">至</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* 已删除显示 */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 dark:border-stone-600 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-stone-600 dark:text-stone-400">显示已删除</span>
            </label>
          </div>

          {/* 来源筛选 */}
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <button
                  key={source.sourceKey}
                  onClick={() => toggleSource(source.sourceKey)}
                  className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all ${
                    selectedSources.includes(source.sourceKey)
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-600'
                  }`}
                >
                  {source.sourceName}
                </button>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-gradient-to-b from-amber-700 to-amber-800 dark:from-amber-600 dark:to-amber-700 text-stone-900 dark:text-stone-100 rounded-xl shadow-sm hover:from-amber-800 hover:to-amber-900 dark:hover:from-amber-500 dark:hover:to-amber-600 hover:shadow-md active:scale-[0.98] transition-all"
            >
              <Search size={14} />
              搜索
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-all"
            >
              <RotateCcw size={14} />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50">
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">标题</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">来源</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">状态</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">发布时间</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">浏览量</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className={`hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors ${item.isDeleted ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-900 dark:text-stone-100 max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {item.sourceName || '-'}
                    </span>
                  </td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                    <div className="flex justify-center gap-1.5">
                      {item.isDeleted ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400">
                          已删除
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.isVisible
                            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}>
                          {item.isVisible ? '显示' : '隐藏'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400 text-xs">
                    {formatDate(item.publishedAt)}
                  </td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400 text-xs">
                    {item.viewCount || 0}
                  </td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/ai-news/${item.id}/edit`}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/70 dark:border-stone-700/50 hover:border-amber-300 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-400 no-underline hover:no-underline"
                      >
                        <Edit size={12} /> 编辑
                      </Link>
                      {!item.isDeleted && (
                        <button
                          className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all ${
                            item.isVisible
                              ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-500/20'
                              : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/70 dark:border-stone-700/50'
                          } hover:border-amber-300 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-400`}
                          onClick={() => handleToggleVisibility(item.id)}
                          title={item.isVisible ? '隐藏' : '显示'}
                        >
                          {item.isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                          {item.isVisible ? '隐藏' : '显示'}
                        </button>
                      )}
                      {!item.isDeleted && (
                        <button
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 flex-nowrap whitespace-nowrap"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={12} /> 删除
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-stone-200/50 dark:border-stone-700/50">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
