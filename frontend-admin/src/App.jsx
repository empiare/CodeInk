import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './pages/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleListAdmin from './pages/ArticleListAdmin';
import ArticleEditor from './pages/ArticleEditor';
import CategoryManager from './pages/CategoryManager';
import TagManager from './pages/TagManager';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<ArticleListAdmin />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/:id/edit" element={<ArticleEditor />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="tags" element={<TagManager />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
