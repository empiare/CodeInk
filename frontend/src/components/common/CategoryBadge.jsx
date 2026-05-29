import { Link } from 'react-router-dom';

export default function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <Link
      to={`/category/${category.slug}`}
      className="text-xs text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 no-underline underline underline-offset-2 decoration-stone-300 dark:decoration-stone-700 hover:decoration-amber-400 transition-colors"
    >
      {category.name}
    </Link>
  );
}
