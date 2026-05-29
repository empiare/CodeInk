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
      <h1 className="admin-page-title">标签管理</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', maxWidth: '300px' }}>
        <div className="form-group">
          <label className="form-label">标签名称</label>
          <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="btn-group">
          <button type="submit" className="btn btn--primary">
            <Plus size={14} /> 添加
          </button>
        </div>
      </form>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map((tag) => (
            <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.25rem 0.5rem' }}>
              <span style={{ fontSize: '0.875rem' }}>{tag.name}</span>
              <button
                onClick={() => handleDelete(tag.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.125rem', display: 'flex' }}
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
