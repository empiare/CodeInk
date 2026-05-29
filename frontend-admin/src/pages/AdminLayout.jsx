import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, FolderOpen, Tags, LogOut, ExternalLink } from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) return <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm pt-24">加载中...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "block px-2 py-1.5 text-sm rounded no-underline transition-colors bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-200"
      : "block px-2 py-1.5 text-sm text-stone-600 dark:text-stone-400 rounded no-underline transition-colors hover:bg-white dark:hover:bg-stone-950 hover:text-stone-900 dark:hover:text-stone-200";

  return (
    <div className="flex min-h-screen">
      <aside className="w-[200px] bg-stone-100 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 px-4 py-6 shrink-0">
        <div className="font-serif text-base font-semibold mb-6 pb-3 border-b border-stone-200 dark:border-stone-800">管理后台</div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={navLinkClass}>
            <LayoutDashboard size={14} className="inline-block align-middle mr-1.5" />
            仪表盘
          </NavLink>
          <NavLink to="/articles" className={navLinkClass}>
            <FileText size={14} className="inline-block align-middle mr-1.5" />
            文章管理
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            <FolderOpen size={14} className="inline-block align-middle mr-1.5" />
            分类管理
          </NavLink>
          <NavLink to="/tags" className={navLinkClass}>
            <Tags size={14} className="inline-block align-middle mr-1.5" />
            标签管理
          </NavLink>
        </nav>
        <div className="mt-8 border-t border-stone-200 dark:border-stone-800 pt-4">
          <a href="/" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400 mb-3 no-underline hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
            <ExternalLink size={14} />
            查看博客
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400 bg-transparent border-none cursor-pointer p-0 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
          >
            <LogOut size={14} />
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 px-8 py-6 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
