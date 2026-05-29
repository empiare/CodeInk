import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} 我的博客 &middot; 用文字记录思考
        </p>
      </div>
    </footer>
  );
}
