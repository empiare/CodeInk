import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';

export default function CommentItem({ comment, replies = [], onReply }) {
  const { isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const date = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setShowReplyForm(!showReplyForm);
  };

  const handleReplySubmit = async (commentData) => {
    await onReply(commentData);
    setShowReplyForm(false);
  };

  return (
    <div className="py-4 border-b border-stone-100 dark:border-stone-900 last:border-none">
      <div className="flex items-baseline gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          {comment.userAvatarUrl ? (
            <img src={comment.userAvatarUrl} alt="头像" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
              {comment.authorName?.[0] || '?'}
            </div>
          )}
          <span className="font-semibold text-sm">{comment.authorName}</span>
        </div>
        <span className="text-xs text-stone-400 dark:text-stone-500">{date}</span>
      </div>

      <div className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{comment.content}</div>

      <div className="mt-2">
        <button
          className="bg-transparent border-none text-stone-400 dark:text-stone-500 text-xs cursor-pointer p-0 hover:text-amber-700 dark:hover:text-amber-400"
          onClick={handleReplyClick}
          title={isAuthenticated ? "回复" : "登录后回复"}
        >
          {isAuthenticated ? '回复' : '登录后回复'}
        </button>
      </div>

      {showReplyForm && (
        <div className="mt-3 p-4 bg-stone-100 dark:bg-stone-900 rounded">
          <CommentForm
            parentId={comment.id}
            onSubmit={handleReplySubmit}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="ml-6 border-l-2 border-stone-100 dark:border-stone-900 pl-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
