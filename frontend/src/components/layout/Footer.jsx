import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-8 text-center border-t border-stone-200/50 dark:border-stone-800/50">
      <p className="text-xs text-stone-400 dark:text-stone-500">
        &copy; {new Date().getFullYear()} Code<span className="text-amber-600 dark:text-amber-400">Ink</span>
        <span className="mx-2">·</span>
        用文字记录思考
      </p>
    </footer>
  );
}
