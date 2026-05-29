import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <Link to="/" className="header__logo">我的博客</Link>

          <button
            className="theme-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none' }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <nav className="header__nav">
            <NavLink to="/" end>首页</NavLink>
            <NavLink to="/articles">文章</NavLink>
            <NavLink to="/about">关于</NavLink>

            <form onSubmit={handleSearch} className="search-bar" style={{ width: '160px' }}>
              <input
                type="text"
                className="search-bar__input"
                placeholder="搜索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="search-bar__shortcut">/</span>
            </form>

            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="user-avatar-link">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="用户头像"
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {user?.displayName?.[0] || user?.username?.[0] || '?'}
                    </div>
                  )}
                </Link>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">个人中心</Link>
                  <button onClick={handleLogout} className="dropdown-item">退出登录</button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn--outline btn--sm">
                  <LogIn size={14} />
                  登录
                </Link>
                <Link to="/register" className="btn btn--primary btn--sm">
                  <UserPlus size={14} />
                  注册
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
