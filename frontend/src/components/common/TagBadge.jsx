import { Link } from 'react-router-dom';

export default function TagBadge({ tag }) {
  return (
    <Link to={`/tag/${tag.slug}`} className="tag">
      {tag.name}
    </Link>
  );
}
