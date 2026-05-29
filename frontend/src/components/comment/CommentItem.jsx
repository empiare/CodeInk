import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm';

export default function CommentItem({ comment, replies = [], onReply }) {
  const { isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const date = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
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
    <div className="p-5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/30 backdrop-blur-sm border border-stone-900/[0.04] dark:border-white/[0.04]">
      <div className="flex items-center gap-3 mb-3">
        {comment.userAvatarUrl ? (
          <img src={comment.userAvatarUrl} alt="头像" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center text-xs font-bold">
            {comment.authorName?.[0] || '?'}
          </div>
        )}
        <div>
          <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">{comment.authorName}</span>
          <span className="text-xs text-stone-400 dark:text-stone-500 ml-2">{date}</span>
        </div>
      </div>

      <div className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed pl-11">
        {comment.content}
      </div>

      <div className="mt-3 pl-11">
        <button
          className="bg-transparent border-none text-stone-400 dark:text-stone-500 text-xs cursor-pointer p-0 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
          onClick={handleReplyClick}
          title={isAuthenticated ? "回复" : "登录后回复"}
        >
          {isAuthenticated ? '回复' : '登录后回复'}
        </button>
      </div>

      {showReplyForm && (
        <div className="mt-4 ml-11">
          <CommentForm
            parentId={comment.id}
            onSubmit={handleReplySubmit}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-4 ml-11 space-y-3 border-l-2 border-stone-200/50 dark:border-stone-700/50 pl-4">
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
