import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');
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
    <header className="fixed top-0 inset-x-0 z-50 bg-stone-50 dark:bg-stone-950 py-6">
      <div className="max-w-[1660px] mx-auto flex justify-between items-center px-3">
        <Link to="/" className="grid flex-col text-xl font-semibold text-stone-900 dark:text-stone-200 tracking-tight no-underline hover:no-underline">Codelnk
          </Link>

        <nav className="flex items-center gap-6">
            <NavLink to="/" end className={({ isActive }) => isActive ? "text-stone-900 dark:text-stone-200 text-sm no-underline" : "text-stone-600 dark:text-stone-400 text-sm no-underline hover:text-stone-900 dark:hover:text-stone-200 transition-colors"}>首页</NavLink>
            <NavLink to="/articles" className={({ isActive }) => isActive ? "text-stone-900 dark:text-stone-200 text-sm no-underline" : "text-stone-600 dark:text-stone-400 text-sm no-underline hover:text-stone-900 dark:hover:text-stone-200 transition-colors"}>文章</NavLink>
            <NavLink to="/news" className={({ isActive }) => isActive ? "text-stone-900 dark:text-stone-200 text-sm no-underline" : "text-stone-600 dark:text-stone-400 text-sm no-underline hover:text-stone-900 dark:hover:text-stone-200 transition-colors"}>资讯</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "text-stone-900 dark:text-stone-200 text-sm no-underline" : "text-stone-600 dark:text-stone-400 text-sm no-underline hover:text-stone-900 dark:hover:text-stone-200 transition-colors"}>关于</NavLink>

            <form onSubmit={handleSearch} className="relative w-40">
              <input
                type="text"
                className="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-200 outline-none focus:border-amber-700 dark:focus:border-amber-500 transition-colors placeholder:text-stone-400 dark:placeholder:text-stone-500"
                placeholder="搜索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-800 px-1.5 py-px rounded-sm font-mono pointer-events-none">/</span>
            </form>

            <button className="p-1 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors bg-transparent border-none cursor-pointer flex items-center" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <Link to="/profile" className="flex items-center no-underline">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="用户头像"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-700 dark:bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                      {user?.displayName?.[0] || user?.username?.[0] || '?'}
                    </div>
                  )}
                </Link>
                <div className="absolute top-full right-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded shadow-md min-w-[150px] hidden group-hover:block z-50">
                  <Link to="/profile" className="block px-4 py-2 text-stone-900 dark:text-stone-200 no-underline w-full text-left bg-transparent border-none cursor-pointer text-sm hover:bg-stone-100 dark:hover:bg-stone-800 hover:no-underline">个人中心</Link>
                  <button onClick={handleLogout} className="block px-4 py-2 text-stone-900 dark:text-stone-200 no-underline w-full text-left bg-transparent border-none cursor-pointer text-sm hover:bg-stone-100 dark:hover:bg-stone-800 hover:no-underline">退出登录</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-stone-300 dark:border-stone-700 rounded text-stone-700 dark:text-stone-300 no-underline hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                  <LogIn size={14} />
                  登录
                </Link>
                <Link to="/register" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-stone-300 dark:border-stone-700 rounded text-stone-700 dark:text-stone-300 no-underline hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                  <UserPlus size={14} />
                  注册
                </Link>
              </div>
            )}
          </nav>
        </div>
    </header>
  );
}
