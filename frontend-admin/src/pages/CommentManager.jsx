import { useState, useEffect } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import client from '../api/client';
import Pagination from '../components/common/Pagination';

export default function CommentManager() {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchComments = (p = page) => {
    setLoading(true);
    client.get('/admin/comments', { params: { page: p, size: 10 } })
      .then((res) => {
        setComments(res?.records || []);
        setTotalPages(res?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    try {
      await client.delete(`/admin/comments/${id}`);
      fetchComments(page);
    } catch {
      alert('删除失败');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">评论管理</h1>
        <span className="text-sm text-stone-400 dark:text-stone-500">
          共 {totalPages > 0 ? (page - 1) * 10 + comments.length : 0} 条评论
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
          <MessageSquare size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
          <p className="text-stone-400 dark:text-stone-500 text-sm">暂无评论</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800/50">
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider w-[60px]">ID</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider w-[100px]">作者</th>
                  <th className="text-left px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">内容</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider w-[120px]">所属文章</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider w-[80px]">状态</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider w-[110px]">时间</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider w-[80px]">操作</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400">{comment.id}</td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-900 dark:text-stone-100">
                      <div className="flex items-center justify-center gap-1.5">
                        {comment.userAvatarUrl && <img src={comment.userAvatarUrl} alt="" className="w-5 h-5 rounded-full" />}
                        <span className="truncate max-w-[80px]">{comment.authorName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-600 dark:text-stone-300">
                      <div className="max-w-[300px] truncate" title={comment.content}>
                        {comment.parentId && <span className="text-xs text-amber-600 dark:text-amber-400 mr-1">[回复]</span>}
                        {comment.content}
                      </div>
                    </td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                      <span className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[100px] inline-block" title={comment.articleTitle}>
                        {comment.articleTitle || '-'}
                      </span>
                    </td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                      {comment.approved ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">已审核</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">待审核</span>
                      )}
                    </td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400 text-xs">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleString('zh-CN') : '-'}
                    </td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                      <button
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 size={12} /> 删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
