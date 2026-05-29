import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import client from '../../api/client';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = () => {
    client.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('分类名称不能为空'); return; }
    setError('');
    try {
      if (editId) {
        await client.put(`/categories/${editId}`, { name: name.trim(), description: description.trim() });
      } else {
        await client.post('/categories', { name: name.trim(), description: description.trim() });
      }
      resetForm();
      fetchCategories();
    } catch {
      setError('操作失败');
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这个分类吗？')) return;
    try {
      await client.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      alert('删除失败');
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">分类管理</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', maxWidth: '400px' }}>
        <div className="form-group">
          <label className="form-label">分类名称</label>
          <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">描述（可选）</label>
          <input type="text" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="btn-group">
          <button type="submit" className="btn btn--primary">
            <Plus size={14} /> {editId ? '更新' : '添加'}
          </button>
          {editId && (
            <button type="button" className="btn" onClick={resetForm}>取消</button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="admin-table" style={{ maxWidth: '500px' }}>
          <thead>
            <tr>
              <th>名称</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description || '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button className="btn btn--sm" onClick={() => handleEdit(cat)}>
                      <Edit size={12} /> 编辑
                    </button>
                    <button className="btn btn--sm btn--danger" onClick={() => handleDelete(cat.id)}>
                      <Trash2 size={12} /> 删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
