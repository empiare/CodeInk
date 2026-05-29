import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CommentForm({ onSubmit, parentId = null }) {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState(isAuthenticated ? user?.displayName : '');
  const [email, setEmail] = useState(isAuthenticated ? user?.email : '');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isReply = parentId !== null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReply && !isAuthenticated) {
      setError('回复评论需要登录');
      return;
    }

    if (!isReply && !isAuthenticated && !name.trim()) {
      setError('请填写昵称');
      return;
    }

    if (!content.trim()) {
      setError('评论内容不能为空');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        authorName: isAuthenticated ? user.displayName : name.trim(),
        authorEmail: isAuthenticated ? user.email : (email.trim() || null),
        content: content.trim(),
        parentId,
      });
      setContent('');
      if (!isAuthenticated) {
        setName('');
        setEmail('');
      }
    } catch (err) {
      setError(err.message || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      {isReply && !isAuthenticated && (
        <div className="p-3 bg-amber-100 dark:bg-amber-950 rounded mb-3 text-sm">
          <p>回复评论需要登录，<a href="/login">点击登录</a></p>
        </div>
      )}

      {!isAuthenticated && !isReply && (
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            className="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors"
            placeholder="昵称 *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
          />
          <input
            type="email"
            className="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors"
            placeholder="邮箱（可选，用于显示头像）"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={100}
          />
        </div>
      )}

      {isAuthenticated && !isReply && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-stone-100 dark:bg-stone-900 rounded">
          <img
            src={user.avatarUrl}
            alt="头像"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span>{user.displayName}</span>
        </div>
      )}

      <textarea
        className="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors min-h-[100px] resize-y leading-relaxed"
        placeholder={isReply ? "写下你的回复..." : "写下你的评论..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
        disabled={isReply && !isAuthenticated}
      />

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

      <button
        type="submit"
        className="inline-flex items-center gap-1.5 px-5 py-2 text-sm bg-amber-700 dark:bg-amber-500 text-white border-none rounded cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-3"
        disabled={submitting || (isReply && !isAuthenticated)}
      >
        {submitting ? '提交中...' : (isReply ? '回复' : '发表评论')}
      </button>
    </form>
  );
}
