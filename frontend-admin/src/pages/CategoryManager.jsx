import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import client from '../api/client';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = () => {
    client.get('/categories')
      .then((res) => setCategories(res || []))
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
      <h1 className="text-xl font-semibold mb-6">分类管理</h1>

      <form onSubmit={handleSubmit} className="mb-8 max-w-[400px]">
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">分类名称</label>
          <input type="text" className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">描述（可选）</label>
          <input type="text" className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        <div className="flex gap-2 mt-4">
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border rounded cursor-pointer transition-all bg-amber-700 dark:bg-amber-500 border-amber-700 dark:border-amber-500 text-white hover:opacity-85 no-underline hover:no-underline">
            <Plus size={14} /> {editId ? '更新' : '添加'}
          </button>
          {editId && (
            <button type="button" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border border-stone-200 dark:border-stone-800 rounded cursor-pointer transition-all bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-200 no-underline hover:no-underline" onClick={resetForm}>取消</button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <table className="w-full border-collapse text-sm max-w-[500px]">
          <thead>
            <tr>
              <th className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">名称</th>
              <th className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">描述</th>
              <th className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-100 dark:hover:bg-stone-900">
                <td className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800">{cat.name}</td>
                <td className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800">{cat.description || '-'}</td>
                <td className="text-left px-3 py-2.5 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex gap-1.5">
                    <button className="inline-flex items-center justify-center gap-1.5 px-2 py-1 text-xs border border-stone-200 dark:border-stone-800 rounded cursor-pointer transition-all bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-200 no-underline hover:no-underline" onClick={() => handleEdit(cat)}>
                      <Edit size={12} /> 编辑
                    </button>
                    <button className="inline-flex items-center justify-center gap-1.5 px-2 py-1 text-xs border rounded cursor-pointer transition-all text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => handleDelete(cat.id)}>
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
