import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import CategoryPage from './pages/CategoryPage';
import TagPage from './pages/TagPage';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import News from './pages/News';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="articles" element={<ArticleList />} />
              <Route path="articles/:slug" element={<ArticleDetail />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="tag/:slug" element={<TagPage />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="news" element={<News />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
