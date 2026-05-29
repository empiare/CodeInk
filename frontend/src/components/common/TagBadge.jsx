import { Link } from 'react-router-dom';

export default function TagBadge({ tag }) {
  return (
    <Link to={`/tag/${tag.slug}`} className="inline-block text-xs text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-sm hover:opacity-80 transition-opacity no-underline">
      {tag.name}
    </Link>
  );
}
