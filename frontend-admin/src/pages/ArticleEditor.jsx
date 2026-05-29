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
      <h1 className="text-xl font-semibold mb-6">{isEdit ? '编辑文章' : '新建文章'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">标题</label>
          <input
            type="text"
            className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="文章标题"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">摘要</label>
          <input
            type="text"
            className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors"
            value={form.summary}
            onChange={(e) => update('summary', e.target.value)}
            placeholder="文章摘要（可选）"
          />
        </div>

        <div className="flex gap-4 mb-4">
          <div className="mb-4 flex-1">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">分类</label>
            <select
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors"
              value={form.categoryId}
              onChange={(e) => update('categoryId', e.target.value)}
            >
              <option value="">无分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex-1">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">封面图 URL（可选）</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors"
              value={form.coverImage}
              onChange={(e) => update('coverImage', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">标签</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="inline-block text-xs text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-sm hover:opacity-80 transition-opacity cursor-pointer" style={{ opacity: form.tagIds.includes(tag.id) ? 1 : 0.5 }}>
                  <input
                    type="checkbox"
                    checked={form.tagIds.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="mr-1"
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">内容（Markdown）</label>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="border border-stone-200 dark:border-stone-800 rounded overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">编辑</div>
              <div className="p-4 min-h-[400px] overflow-y-auto">
                <textarea
                  className="w-full h-full min-h-[400px] p-0 border-none resize-none font-mono text-xs leading-relaxed bg-transparent text-stone-900 dark:text-stone-200 outline-none"
                  value={form.content}
                  onChange={(e) => update('content', e.target.value)}
                  placeholder="使用 Markdown 编写文章内容..."
                />
              </div>
            </div>
            <div className="border border-stone-200 dark:border-stone-800 rounded overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">预览</div>
              <div className="p-4 min-h-[400px] overflow-y-auto [&_.article-body]:text-[15px]">
                <MarkdownRenderer content={form.content} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 my-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update('published', e.target.checked)}
            />
            发布
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
            />
            置顶
          </label>
        </div>

        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

        <div className="flex gap-2 mt-4">
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border rounded cursor-pointer transition-all bg-amber-700 dark:bg-amber-500 border-amber-700 dark:border-amber-500 text-white hover:opacity-85 no-underline hover:no-underline" disabled={saving}>
            {saving ? '保存中...' : '保存文章'}
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border border-stone-200 dark:border-stone-800 rounded cursor-pointer transition-all bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-200 no-underline hover:no-underline" onClick={() => navigate('/articles')}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
