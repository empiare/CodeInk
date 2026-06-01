import { Link } from 'react-router-dom';

export default function TagBadge({ tag }) {
  return (
    <Link
      to={`/tag/${tag.slug}`}
      className="inline-flex items-center text-sm font-medium bg-stone-100 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 px-2 py-0.5 rounded-full hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 transition-colors duration-200 no-underline"
    >
      {tag.name}
    </Link>
  );
}
