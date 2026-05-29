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

  const inputClass = "w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500";

  return (
    <div className={isReply ? '' : 'mt-8 p-6 rounded-2xl bg-white dark:bg-stone-900/60 backdrop-blur-sm border border-stone-900/[0.06] dark:border-white/[0.06] shadow-sm'}>
      {!isReply && (
        <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-4">发表评论</h4>
      )}

      <form onSubmit={handleSubmit}>
        {isReply && !isAuthenticated && (
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl mb-3 text-sm text-amber-700 dark:text-amber-400">
            <p>回复评论需要登录，<a href="/login">点击登录</a></p>
          </div>
        )}

        {!isAuthenticated && !isReply && (
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              className={inputClass}
              placeholder="昵称 *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <input
              type="email"
              className={inputClass}
              placeholder="邮箱（可选，用于显示头像）"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
            />
          </div>
        )}

        {isAuthenticated && !isReply && (
          <div className="flex items-center gap-2.5 mb-4 p-3 bg-stone-50 dark:bg-stone-800/30 rounded-xl">
            <img
              src={user.avatarUrl}
              alt="头像"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{user.displayName}</span>
          </div>
        )}

        <textarea
          className={`${inputClass} min-h-[120px] resize-y leading-relaxed`}
          placeholder={isReply ? "写下你的回复..." : "写下你的评论..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          disabled={isReply && !isAuthenticated}
        />

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 mt-3 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting || (isReply && !isAuthenticated)}
        >
          {submitting ? '提交中...' : (isReply ? '回复' : '发表评论')}
        </button>
      </form>
    </div>
  );
}
