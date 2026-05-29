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
    <form className="comment-form" onSubmit={handleSubmit}>
      {isReply && !isAuthenticated && (
        <div className="comment-form__login-notice">
          <p>回复评论需要登录，<a href="/login">点击登录</a></p>
        </div>
      )}

      {!isAuthenticated && !isReply && (
        <div className="comment-form__row">
          <input
            type="text"
            className="comment-form__input"
            placeholder="昵称 *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
          />
          <input
            type="email"
            className="comment-form__input"
            placeholder="邮箱（可选，用于显示头像）"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={100}
          />
        </div>
      )}

      {isAuthenticated && !isReply && (
        <div className="comment-form__user-info">
          <img
            src={user.avatarUrl}
            alt="头像"
            className="comment-form__avatar"
          />
          <span>{user.displayName}</span>
        </div>
      )}

      <textarea
        className="comment-form__textarea"
        placeholder={isReply ? "写下你的回复..." : "写下你的评论..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
        disabled={isReply && !isAuthenticated}
      />

      {error && <p className="error-msg">{error}</p>}

      <div className="btn-group" style={{ marginTop: '0.75rem' }}>
        <button
          type="submit"
          className="comment-form__btn"
          disabled={submitting || (isReply && !isAuthenticated)}
        >
          {submitting ? '提交中...' : (isReply ? '回复' : '发表评论')}
        </button>
      </div>
    </form>
  );
}
