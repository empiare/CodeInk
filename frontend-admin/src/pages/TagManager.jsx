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

  const inputClass = "w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-stone-900 dark:text-stone-100 tracking-tight">标签管理</h1>

      <form onSubmit={handleSubmit} className="mb-8 max-w-[350px] p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
        <h3 className="text-base font-semibold mb-4 text-stone-900 dark:text-stone-100">添加标签</h3>
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">标签名称</label>
          <input type="text" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入标签名称" />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="flex gap-2 mt-5">
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all">
            <Plus size={14} /> 添加
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag.id} className="inline-flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-900/[0.06] dark:border-white/[0.06] rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{tag.name}</span>
              <button
                onClick={() => handleDelete(tag.id)}
                className="bg-transparent border-none cursor-pointer text-stone-400 dark:text-stone-500 p-0.5 flex hover:text-red-600 dark:hover:text-red-400 transition-colors rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
