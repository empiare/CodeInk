import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import client from '../../api/client';
import Pagination from '../../components/common/Pagination';

export default function ArticleListAdmin() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchArticles = () => {
    setLoading(true);
    client.get(`/articles?page=${page}&size=20`)
      .then((res) => {
        setArticles(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 0);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>文章管理</h1>
        <Link to="/admin/articles/new" className="btn btn--primary">
          <Plus size={14} /> 新建文章
        </Link>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>标题</th>
                <th>分类</th>
                <th>状态</th>
                <th>日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.category?.name || '-'}</td>
                  <td>{article.published ? '已发布' : '草稿'}</td>
                  <td>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <Link to={`/admin/articles/${article.id}/edit`} className="btn btn--sm">
                        <Edit size={12} /> 编辑
                      </Link>
                      <button className="btn btn--sm btn--danger" onClick={() => handleDelete(article.id)}>
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
