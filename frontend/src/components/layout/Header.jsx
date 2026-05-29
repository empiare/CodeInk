import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const navLinkClass = ({ isActive }) =>
    `relative text-sm py-1 transition-colors no-underline ${
      isActive
        ? 'text-stone-900 dark:text-stone-100 font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-amber-500 after:rounded-full after:scale-x-100 after:transition-transform after:duration-300 after:origin-center'
        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-amber-500 after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center'
    }`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 py-4 bg-stone-50 dark:bg-stone-950 border-b border-stone-900/[0.06] dark:border-white/[0.06]" style={{ willChange: 'transform' }}>
      <div className="max-w-[1660px] mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight no-underline hover:no-underline">
          Code<span className="text-amber-600 dark:text-amber-400">Ink</span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>首页</NavLink>
          <NavLink to="/articles" className={navLinkClass}>文章</NavLink>
          <NavLink to="/news" className={navLinkClass}>资讯</NavLink>
          <NavLink to="/about" className={navLinkClass}>关于</NavLink>

          <form onSubmit={handleSearch} className="relative w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2 text-sm bg-white/60 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-900 dark:text-stone-200 outline-none focus:border-amber-500/60 dark:focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
              placeholder="搜索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <button
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/[0.05] rounded-xl transition-all bg-transparent border-none cursor-pointer flex items-center"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center cursor-pointer"
                onMouseEnter={() => setShowDropdown(true)}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="用户头像"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-sm">
                    {user?.displayName?.[0] || user?.username?.[0] || '?'}
                  </div>
                )}
              </div>
              {showDropdown && (
                <div
                  className="absolute top-full right-0 mt-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border border-stone-200/70 dark:border-stone-700/50 rounded-xl shadow-lg min-w-[160px] z-50 overflow-hidden"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <Link to="/profile" className="block px-4 py-2.5 text-stone-700 dark:text-stone-300 no-underline w-full text-left bg-transparent border-none cursor-pointer text-sm hover:bg-stone-100 dark:hover:bg-stone-800/50 hover:no-underline transition-colors" onClick={() => setShowDropdown(false)}>个人中心</Link>
                  <button onClick={() => { handleLogout(); setShowDropdown(false); }} className="block px-4 py-2.5 text-stone-700 dark:text-stone-300 no-underline w-full text-left bg-transparent border-none cursor-pointer text-sm hover:bg-stone-100 dark:hover:bg-stone-800/50 hover:no-underline transition-colors">退出登录</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-white/70 dark:bg-stone-800/50 backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/50 rounded-xl text-stone-700 dark:text-stone-300 no-underline hover:bg-white dark:hover:bg-stone-800/70 hover:shadow-sm transition-all">
                <LogIn size={14} />
                登录
              </Link>
              <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white rounded-xl no-underline hover:from-amber-700 hover:to-amber-800 dark:hover:from-amber-400 dark:hover:to-amber-500 shadow-sm hover:shadow-md transition-all">
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
