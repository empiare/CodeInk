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

  const inputClass = "w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-stone-900 dark:text-stone-100 tracking-tight">分类管理</h1>

      <form onSubmit={handleSubmit} className="mb-8 w-full p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
        <h3 className="text-base font-semibold mb-4 text-stone-900 dark:text-stone-100">{editId ? '编辑分类' : '添加分类'}</h3>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">分类名称</label>
            <input type="text" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入分类名称" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">描述（可选）</label>
            <input type="text" className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="请输入分类描述" />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all">
            <Plus size={14} /> {editId ? '更新' : '添加'}
          </button>
          {editId && (
            <button type="button" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 text-stone-700 dark:text-stone-300 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-stone-800/70 hover:shadow-sm transition-all" onClick={resetForm}>取消</button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden w-full">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50">
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">名称</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">描述</th>
                <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-900 dark:text-stone-100">{cat.name}</td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400">{cat.description || '-'}</td>
                  <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                    <div className="flex justify-center gap-2">
                      <button className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/70 dark:border-stone-700/50 hover:border-amber-300 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-400" onClick={() => handleEdit(cat)}>
                        <Edit size={12} /> 编辑
                      </button>
                      <button className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => handleDelete(cat.id)}>
                        <Trash2 size={12} /> 删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
