import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import client from '../api/client';

export default function TagManager() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTags = () => {
    client.get('/tags')
      .then((res) => setTags(res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTags(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('标签名称不能为空'); return; }
    setError('');
    try {
      await client.post('/tags', { name: name.trim() });
      setName('');
      fetchTags();
    } catch {
      setError('添加失败');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这个标签吗？')) return;
    try {
      await client.delete(`/tags/${id}`);
      fetchTags();
    } catch {
      alert('删除失败');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">标签管理</h1>

      <form onSubmit={handleSubmit} className="mb-8 max-w-[300px]">
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">标签名称</label>
          <input type="text" className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        <div className="flex gap-2 mt-4">
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border rounded cursor-pointer transition-all bg-amber-700 dark:bg-amber-500 border-amber-700 dark:border-amber-500 text-white hover:opacity-85 no-underline hover:no-underline">
            <Plus size={14} /> 添加
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-1 border border-stone-200 dark:border-stone-800 rounded px-2 py-1">
              <span className="text-sm">{tag.name}</span>
              <button
                onClick={() => handleDelete(tag.id)}
                className="bg-transparent border-none cursor-pointer text-stone-400 dark:text-stone-500 p-0.5 flex hover:text-red-600 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
