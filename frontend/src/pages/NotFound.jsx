import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found__code">404</div>
        <p className="not-found__msg">页面不存在</p>
        <Link to="/" className="btn">返回首页</Link>
      </div>
    </div>
  );
}
