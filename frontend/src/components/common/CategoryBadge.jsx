import { Link } from 'react-router-dom';

export default function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <Link to={`/category/${category.slug}`} className="category">
      {category.name}
    </Link>
  );
}
