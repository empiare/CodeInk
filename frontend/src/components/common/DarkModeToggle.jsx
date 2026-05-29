import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="p-1 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors bg-transparent border-none cursor-pointer flex items-center" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
