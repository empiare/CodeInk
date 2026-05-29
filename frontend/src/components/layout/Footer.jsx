import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-8 text-center text-stone-400 dark:text-stone-500 text-xs">
      <p>
        &copy; {new Date().getFullYear()} Codelnk
        &middot; 用文字记录思考
      </p>
    </footer>
  );
}
