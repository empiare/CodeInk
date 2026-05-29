import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import client from '../api/client';
import Pagination from '../components/common/Pagination';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = (p = page, kw = keyword) => {
    setLoading(true);
    const params = { page: p, size: 10 };
    if (kw) params.keyword = kw;
    client.get('/admin/users', { params })
      .then((res) => {
        setUsers(res?.records || []);
        setTotalPages(res?.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const resetForm = () => {
    setForm({ username: '', email: '', password: '', displayName: '' });
    setEditId(null);
    setError('');
    setShowForm(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, keyword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim()) {
      setError('用户名和邮箱不能为空');
      return;
    }
    if (!editId && !form.password) {
      setError('密码不能为空');
      return;
    }
    setError('');
    try {
      if (editId) {
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;
        await client.put(`/admin/users/${editId}`, updateData);
      } else {
        await client.post('/admin/users', form);
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err?.message || '操作失败');
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({
      username: user.username || '',
      email: user.email || '',
      password: '',
      displayName: user.displayName || ''
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这个用户吗？')) return;
    try {
      await client.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch {
      alert('删除失败');
    }
  };

  const inputClass = "w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">用户管理</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all"
        >
          <Plus size={14} /> 添加用户
        </button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2 max-w-[400px]">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            className={inputClass + " pl-9"}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索用户名、邮箱、昵称..."
          />
        </div>
        <button type="submit" className="px-4 py-2.5 text-sm font-medium bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 text-stone-700 dark:text-stone-300 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-stone-800/70 hover:shadow-sm transition-all">
          搜索
        </button>
      </form>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <form onSubmit={handleSubmit} className="w-[420px] p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-xl">
            <h3 className="text-base font-semibold mb-4 text-stone-900 dark:text-stone-100">{editId ? '编辑用户' : '添加用户'}</h3>
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">用户名</label>
              <input type="text" className={inputClass} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="请输入用户名" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">邮箱</label>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="请输入邮箱" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">密码{editId && '（留空则不修改）'}</label>
              <input type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editId ? '留空则不修改' : '请输入密码'} />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">昵称</label>
              <input type="text" className={inputClass} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="请输入昵称（可选）" />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <div className="flex gap-2 mt-5">
              <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none rounded-xl cursor-pointer shadow-sm hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 hover:shadow-md active:scale-[0.98] transition-all">
                <Plus size={14} /> {editId ? '更新' : '创建'}
              </button>
              <button type="button" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 text-stone-700 dark:text-stone-300 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-stone-800/70 hover:shadow-sm transition-all" onClick={resetForm}>取消</button>
            </div>
          </form>
        </div>
      )}

      {/* User table */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm">加载中...</div>
      ) : (
        <>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800/50">
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">ID</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">用户名</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">邮箱</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">昵称</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">注册时间</th>
                  <th className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-semibold text-stone-600 dark:text-stone-400 text-xs uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400">{user.id}</td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-900 dark:text-stone-100">
                      <div className="flex items-center justify-center gap-2">
                        {user.avatarUrl && <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />}
                        {user.username}
                      </div>
                    </td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400">{user.email}</td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400">{user.displayName || '-'}</td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 text-stone-500 dark:text-stone-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="text-center px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50">
                      <div className="flex justify-center gap-2">
                        <button className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/70 dark:border-stone-700/50 hover:border-amber-300 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-400" onClick={() => handleEdit(user)}>
                          <Edit size={12} /> 编辑
                        </button>
                        <button className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs rounded-lg cursor-pointer transition-all text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => handleDelete(user.id)}>
                          <Trash2 size={12} /> 删除
                        </button>
                      </div>
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
