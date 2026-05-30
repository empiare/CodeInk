import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import client from '../api/client';
import MarkdownRenderer from '../components/article/MarkdownRenderer';

export default function AiNewsEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    summary: '',
    coverImage: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 加载资讯数据
  useEffect(() => {
    client.get(`/admin/ai-news/${id}`)
      .then((res) => {
        setForm({
          title: res.title || '',
          summary: res.summary || '',
          coverImage: res.coverImage || '',
          content: res.content || ''
        });
      })
      .catch(() => {
        setError('加载资讯失败');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 更新表单字段
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // 保存
  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('标题不能为空');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await client.put(`/admin/ai-news/${id}`, form);
      navigate('/ai-news');
    } catch {
      setError('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/ai-news')}
            className="inline-flex items-center gap-1 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft size={16} />
            返回列表
          </button>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">编辑资讯</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-base font-bold bg-gradient-to-b from-amber-700 to-amber-800 dark:from-amber-600 dark:to-amber-700 text-stone-900 dark:text-stone-100 rounded-xl shadow-sm hover:from-amber-800 hover:to-amber-900 dark:hover:from-amber-500 dark:hover:to-amber-600 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? '保存中...' : '保存'}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 基本信息区域 */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] p-4 mb-4 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="请输入标题"
              className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">封面图URL</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => handleChange('coverImage', e.target.value)}
              placeholder="请输入封面图URL（可选）"
              className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">摘要</label>
            <textarea
              value={form.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder="请输入摘要（可选）"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Markdown编辑区 */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {/* 编辑区 */}
        <div className="flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="px-4 py-2 border-b border-stone-200/50 dark:border-stone-700/50 bg-stone-50 dark:bg-stone-800/50">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">Markdown 编辑</span>
          </div>
          <textarea
            value={form.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="请输入Markdown内容..."
            className="flex-1 p-4 text-sm font-mono bg-transparent text-stone-900 dark:text-stone-100 resize-none focus:outline-none"
          />
        </div>

        {/* 预览区 */}
        <div className="flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="px-4 py-2 border-b border-stone-200/50 dark:border-stone-700/50 bg-stone-50 dark:bg-stone-800/50">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">实时预览</span>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <MarkdownRenderer content={form.content || '*暂无内容*'} />
          </div>
        </div>
      </div>
    </div>
  );
}
