import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import CommentForm from './CommentForm';

export default function CommentItem({ comment, replies = [], onReply, onDelete }) {
  const { isAuthenticated, user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalState, setModalState] = useState(null);

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

  const handleDeleteClick = () => {
    setModalState('confirm');
  };

  const handleDeleteConfirm = async () => {
    setModalState(null);
    setDeleting(true);
    try {
      await client.delete(`/comments/${comment.id}`);
      onDelete?.(comment.id);
    } catch {
      setModalState('error');
    } finally {
      setDeleting(false);
    }
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
        {user && comment.userId === user.id && (
          <button
            className="bg-transparent border-none text-stone-400 dark:text-stone-500 text-xs cursor-pointer p-0 ml-3 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            onClick={handleDeleteClick}
            title="删除"
            disabled={deleting}
          >
            {deleting ? '删除中...' : '删除'}
          </button>
        )}
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
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {modalState && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setModalState(null)}>
          <div className="absolute inset-0 bg-black/20" />
          <div
            className="relative bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 mx-4 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-stone-700 dark:text-stone-300 mb-5 leading-relaxed">
              {modalState === 'confirm' ? '确定要删除这条评论吗？此操作不可撤销。' : '删除失败，请重试'}
            </p>
            <div className="flex justify-end gap-3">
              {modalState === 'confirm' ? (
                <>
                  <button
                    className="px-4 py-2 text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors cursor-pointer border-none"
                    onClick={() => setModalState(null)}
                  >
                    取消
                  </button>
                  <button
                    className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors cursor-pointer border-none"
                    onClick={handleDeleteConfirm}
                  >
                    确认删除
                  </button>
                </>
              ) : (
                <button
                  className="px-4 py-2 text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors cursor-pointer border-none"
                  onClick={() => setModalState(null)}
                >
                  关闭
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
