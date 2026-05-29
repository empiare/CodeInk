import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import MarkdownRenderer from '../components/article/MarkdownRenderer';

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
    coverImage: '',
    categoryId: '',
    tagIds: [],
    published: false,
    featured: false,
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/categories').then((res) => setCategories(res || [])).catch(() => {});
    client.get('/tags').then((res) => setTags(res || [])).catch(() => {});

    if (isEdit) {
      client.get(`/articles/id/${id}`)
        .then((res) => {
          const a = res;
          setForm({
            title: a.title || '',
            content: a.content || '',
            summary: a.summary || '',
            coverImage: a.coverImage || '',
            categoryId: a.categoryId || '',
            tagIds: a.tags?.map((t) => t.id) || [],
            published: a.published || false,
            featured: a.featured || false,
          });
        })
        .catch(() => setError('加载文章失败'));
    }
  }, [id, isEdit]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleTagToggle = (tagId) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('标题和内容不能为空');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || null,
      };
      if (isEdit) {
        await client.put(`/articles/${id}`, payload);
      } else {
        await client.post('/articles', payload);
      }
      navigate('/articles');
    } catch {
      setError('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">{isEdit ? '编辑文章' : '新建文章'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">标题</label>
          <input
            type="text"
            className="form-input"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="文章标题"
          />
        </div>

        <div className="form-group">
          <label className="form-label">摘要</label>
          <input
            type="text"
            className="form-input"
            value={form.summary}
            onChange={(e) => update('summary', e.target.value)}
            placeholder="文章摘要（可选）"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">分类</label>
            <select
              className="form-select"
              value={form.categoryId}
              onChange={(e) => update('categoryId', e.target.value)}
            >
              <option value="">无分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">封面图 URL（可选）</label>
            <input
              type="text"
              className="form-input"
              value={form.coverImage}
              onChange={(e) => update('coverImage', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {tags.length > 0 && (
          <div className="form-group">
            <label className="form-label">标签</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tags.map((tag) => (
                <label key={tag.id} className="tag" style={{ cursor: 'pointer', opacity: form.tagIds.includes(tag.id) ? 1 : 0.5 }}>
                  <input
                    type="checkbox"
                    checked={form.tagIds.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    style={{ marginRight: '0.25rem' }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">内容（Markdown）</label>
          <div className="editor-layout">
            <div className="editor-pane">
              <div className="editor-pane__header">编辑</div>
              <div className="editor-pane__body">
                <textarea
                  className="editor-textarea"
                  value={form.content}
                  onChange={(e) => update('content', e.target.value)}
                  placeholder="使用 Markdown 编写文章内容..."
                />
              </div>
            </div>
            <div className="editor-pane">
              <div className="editor-pane__header">预览</div>
              <div className="editor-pane__body editor-preview">
                <MarkdownRenderer content={form.content} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update('published', e.target.checked)}
            />
            发布
          </label>
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
            />
            置顶
          </label>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="btn-group">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? '保存中...' : '保存文章'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/articles')}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
