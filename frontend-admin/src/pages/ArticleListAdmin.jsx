import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import client from '../api/client';
import Pagination from '../components/common/Pagination';

export default function ArticleListAdmin() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchArticles = () => {
    setLoading(true);
    client.get(`/articles?page=${page}&size=20`)
      .then((res) => {
        setArticles(res?.content || []);
        setTotalPages(res?.totalPages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这篇文章吗？')) return;
    try {
      await client.delete(`/articles/${id}`);
      fetchArticles();
    } catch {
      alert('删除失败');
    }
  };

  const handleFeature = async (article) => {
    try {
      await client.put(`/articles/${article.id}/feature`, { featured: !article.featured });
      fetchArticles();
    } catch (err) {
      alert(err.message || '操作失败');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold mb-0 text-stone-900 dark:text-stone-100 tracking-tight">文章管理</h1>
        <Link to="/articles/new" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-base font-bold bg-gradient-to-b from-amber-700 to-amber-800 dark:from-amber-600 dark:to-amber-700 text-stone-900 dark:text-stone-100 rounded-xl shadow-sm hover:from-amber-800 hover:to-amber-900 dark:hover:from-amber-500 dark:hover:to-amber-600 hover:shadow-md active:scale-[0.98] transition-all no-underline hover:no-underline">
          <Plus size={16} /> 新建文章
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50">
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">标题</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">分类</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">状态</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">日期</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-900 dark:text-stone-100">{article.title}</td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-600 dark:text-stone-400">{article.category?.name || '-'}</td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      article.published
                        ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}>
                      {article.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400 text-xs">{article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '-'}</td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                    <div className="flex justify-center gap-2">
                      <button
                        className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all ${
                          article.featured
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/70 dark:border-stone-700/50 hover:border-amber-300 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-400'
                        }`}
                        onClick={() => handleFeature(article)}
                        title={article.featured ? '取消精选' : '设为精选'}
                      >
                        <Star size={12} fill={article.featured ? 'currentColor' : 'none'} /> {article.featured ? '取消精选' : '精选'}
                      </button>
                      <Link to={`/articles/${article.id}/edit`} className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/70 dark:border-stone-700/50 hover:border-amber-300 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-400 no-underline hover:no-underline">
                        <Edit size={12} /> 编辑
                      </Link>
                      <button className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => handleDelete(article.id)}>
                        <Trash2 size={12} /> 删除
                      </button>
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
