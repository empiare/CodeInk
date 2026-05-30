import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, FolderOpen, Tags, Users, MessageSquare, LogOut, ExternalLink, Clock, Newspaper } from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) return <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm pt-24">加载中...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm no-underline transition-all duration-200 ${
      isActive
        ? 'bg-white/80 dark:bg-white/[0.08] text-stone-900 dark:text-stone-100 shadow-sm font-medium'
        : 'text-stone-600 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-white/[0.04] hover:text-stone-900 dark:hover:text-stone-200'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white/60 dark:bg-stone-900/50 backdrop-blur-xl border-b border-stone-900/[0.06] dark:border-white/[0.04] px-6 py-3 shrink-0">
        <div className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Code<span className="text-amber-600 dark:text-amber-400">Ink</span>
          <span className="text-xs font-normal text-stone-400 dark:text-stone-500 ml-1.5">管理后台</span>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-[220px] bg-white/60 dark:bg-stone-900/50 backdrop-blur-xl border-r border-stone-900/[0.06] dark:border-white/[0.04] px-4 py-6 shrink-0 flex flex-col">
          <nav className="flex flex-col gap-1 flex-1">
          <NavLink to="/" end className={navLinkClass}>
            <LayoutDashboard size={16} />
            仪表盘
          </NavLink>
          <NavLink to="/users" className={navLinkClass}>
            <Users size={16} />
            用户管理
          </NavLink>
          <NavLink to="/articles" className={navLinkClass}>
            <FileText size={16} />
            文章管理
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            <FolderOpen size={16} />
            分类管理
          </NavLink>
          <NavLink to="/tags" className={navLinkClass}>
            <Tags size={16} />
            标签管理
          </NavLink>
          <NavLink to="/comments" className={navLinkClass}>
            <MessageSquare size={16} />
            评论管理
          </NavLink>
          <NavLink to="/ai-news" className={navLinkClass}>
            <Newspaper size={16} />
            资讯管理
          </NavLink>
          <NavLink to="/tasks" className={navLinkClass}>
            <Clock size={16} />
            定时任务
          </NavLink>
        </nav>
        <div className="mt-auto border-t border-stone-200/50 dark:border-stone-800/50 pt-4 flex flex-col gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-stone-600 dark:text-stone-400 no-underline hover:bg-stone-50 dark:hover:bg-white/[0.04] hover:text-stone-900 dark:hover:text-stone-200 transition-all">
            <ExternalLink size={16} />
            查看博客
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-stone-600 dark:text-stone-400 bg-transparent border-none cursor-pointer hover:bg-stone-50 dark:hover:bg-white/[0.04] hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 px-8 py-6 overflow-x-auto bg-stone-50 dark:bg-stone-950">
        <Outlet />
      </main>
      </div>
    </div>
  );
}
