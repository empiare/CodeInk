import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center pt-24 pb-16">
        <div className="text-5xl font-light text-stone-400 dark:text-stone-500 mb-2">404</div>
        <p className="text-stone-600 dark:text-stone-400 mb-6">页面不存在</p>
        <Link to="/" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border border-stone-200 dark:border-stone-800 rounded cursor-pointer transition-all bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-200 hover:no-underline">返回首页</Link>
      </div>
    </div>
  );
}
