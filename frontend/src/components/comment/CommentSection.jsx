import { useState, useEffect } from 'react';
import client from '../../api/client';
import { sampleComments } from '../../data/sampleData';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

// Set to true to use sample data instead of API
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
    <section className="comments">
      <h3 className="comments__title">评论 ({comments.length})</h3>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : rootComments.length === 0 ? (
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          还没有评论，来说点什么吧
        </p>
      ) : (
        rootComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={comments.filter((c) => c.parentId === comment.id)}
            onReply={handleReply}
          />
        ))
      )}

      <CommentForm onSubmit={handleSubmit} />
    </section>
  );
}
