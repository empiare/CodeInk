import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, FolderOpen, Tags, LogOut, ExternalLink } from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) return <div className="loading" style={{ paddingTop: '6rem' }}>加载中...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__title">管理后台</div>
        <nav className="admin-sidebar__nav">
          <NavLink to="/" end>
            <LayoutDashboard size={14} style={{ marginRight: '0.375rem', verticalAlign: 'middle' }} />
            仪表盘
          </NavLink>
          <NavLink to="/articles">
            <FileText size={14} style={{ marginRight: '0.375rem', verticalAlign: 'middle' }} />
            文章管理
          </NavLink>
          <NavLink to="/categories">
            <FolderOpen size={14} style={{ marginRight: '0.375rem', verticalAlign: 'middle' }} />
            分类管理
          </NavLink>
          <NavLink to="/tags">
            <Tags size={14} style={{ marginRight: '0.375rem', verticalAlign: 'middle' }} />
            标签管理
          </NavLink>
        </nav>
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
             style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <ExternalLink size={14} />
            查看博客
          </a>
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <LogOut size={14} />
            退出登录
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
