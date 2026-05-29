import { Link } from 'react-router-dom';

export default function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <Link to={`/category/${category.slug}`} className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 no-underline">
      {category.name}
    </Link>
  );
}
