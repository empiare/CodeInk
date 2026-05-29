import { useState, useEffect } from 'react';
import client from '../../api/client';
import { sampleComments } from '../../data/sampleData';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const USE_SAMPLE_DATA = false;

export default function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    if (USE_SAMPLE_DATA) {
      const filtered = sampleComments.filter((c) => c.articleId === articleId && c.approved);
      setTimeout(() => {
        setComments(filtered);
        setLoading(false);
      }, 300);
      return;
    }

    client.get(`/comments/article/${articleId}`)
      .then((res) => setComments(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (articleId) fetchComments();
  }, [articleId]);

  const handleSubmit = async (commentData) => {
    if (USE_SAMPLE_DATA) {
      const newComment = {
        id: Date.now(),
        articleId,
        ...commentData,
        approved: true,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);
      return;
    }

    await client.post('/comments', {
      ...commentData,
      articleId,
    });
    fetchComments();
  };

  const handleReply = async (commentData) => {
    await handleSubmit(commentData);
  };

  const rootComments = comments.filter((c) => !c.parentId);

  return (
    <section className="mt-16 pt-10 border-t border-stone-200/50 dark:border-stone-800/50">
      <h3 className="text-lg font-semibold mb-8 text-stone-900 dark:text-stone-100">
        评论
        <span className="ml-2 text-sm font-normal text-stone-400">({comments.length})</span>
      </h3>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : rootComments.length === 0 ? (
        <p className="text-stone-400 dark:text-stone-500 text-sm mb-8">
          还没有评论，来说点什么吧
        </p>
      ) : (
        <div className="space-y-4 mb-8">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={comments.filter((c) => c.parentId === comment.id)}
              onReply={handleReply}
            />
          ))}
        </div>
      )}

      <CommentForm onSubmit={handleSubmit} />
    </section>
  );
}
