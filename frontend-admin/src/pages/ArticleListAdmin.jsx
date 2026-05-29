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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold mb-0">文章管理</h1>
        <Link to="/articles/new" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border rounded cursor-pointer transition-all bg-amber-700 dark:bg-amber-500 border-amber-700 dark:border-amber-500 text-white hover:opacity-85 no-underline hover:no-underline">
          <Plus size={14} /> 新建文章
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">标题</th>
                <th className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">分类</th>
                <th className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">状态</th>
                <th className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">日期</th>
                <th className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-stone-100 dark:hover:bg-stone-900">
                  <td className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800">{article.title}</td>
                  <td className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800">{article.category?.name || '-'}</td>
                  <td className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800">{article.published ? '已发布' : '草稿'}</td>
                  <td className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800">{article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '-'}</td>
                  <td className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex gap-1.5">
                      <button
                        className={`inline-flex items-center justify-center gap-1.5 px-2 py-1 text-xs border rounded cursor-pointer transition-all no-underline hover:no-underline ${article.featured ? 'text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white' : 'bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-200 border-stone-200 dark:border-stone-800'}`}
                        onClick={() => handleFeature(article)}
                        title={article.featured ? '取消精选' : '设为精选'}
                      >
                        <Star size={12} fill={article.featured ? 'currentColor' : 'none'} /> {article.featured ? '取消精选' : '精选'}
                      </button>
                      <Link to={`/articles/${article.id}/edit`} className="inline-flex items-center justify-center gap-1.5 px-2 py-1 text-xs border border-stone-200 dark:border-stone-800 rounded cursor-pointer transition-all bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-200 no-underline hover:no-underline">
                        <Edit size={12} /> 编辑
                      </Link>
                      <button className="inline-flex items-center justify-center gap-1.5 px-2 py-1 text-xs border rounded cursor-pointer transition-all text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => handleDelete(article.id)}>
                        <Trash2 size={12} /> 删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
