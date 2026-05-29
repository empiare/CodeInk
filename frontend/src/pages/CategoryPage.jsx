import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useArticles, useCategories } from '../hooks';
import ArticleItem from '../components/article/ArticleItem';
import Pagination from '../components/common/Pagination';

export default function CategoryPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(0);
  const { content: articles, totalPages, loading } = useArticles({ page, size: 10, category: slug });
  const categories = useCategories();
  const categoryName = categories.find((c) => c.slug === slug)?.name || slug;

  return (
    <div className="max-w-6xl mx-auto px-6">
      <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-200 tracking-tight my-10 mx-0">分类：{categoryName}</h1>
      {!loading && articles.length === 0 && (
        <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-[15px]">该分类下暂无文章</div>
      )}
      {articles.length > 0 && (
        <div className="flex flex-col">
          {articles.map((article) => (
            <ArticleItem key={article.id} article={article} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
