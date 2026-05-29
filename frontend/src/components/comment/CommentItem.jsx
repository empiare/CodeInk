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
    <div className="comment">
      <div className="comment__header">
        <div className="comment__author-info">
          {comment.userAvatarUrl ? (
            <img src={comment.userAvatarUrl} alt="头像" className="comment__avatar" />
          ) : (
            <div className="comment__avatar-placeholder">
              {comment.authorName?.[0] || '?'}
            </div>
          )}
          <span className="comment__author">{comment.authorName}</span>
        </div>
        <span className="comment__date">{date}</span>
      </div>

      <div className="comment__body">{comment.content}</div>

      <div className="comment__actions">
        <button
          className="comment__reply-btn"
          onClick={handleReplyClick}
          title={isAuthenticated ? "回复" : "登录后回复"}
        >
          {isAuthenticated ? '回复' : '登录后回复'}
        </button>
      </div>

      {showReplyForm && (
        <div className="comment__reply-form">
          <CommentForm
            parentId={comment.id}
            onSubmit={handleReplySubmit}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="comment__replies">
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
