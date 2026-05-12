import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { newsAPI } from '../services/api';
import NewsCard from '../components/news/NewsCard';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import { FiRefreshCw } from 'react-icons/fi';

const CATEGORY_META = {
  general: { icon: '🌐', label: 'General', desc: 'Top stories from around the world' },
  technology: { icon: '💻', label: 'Technology', desc: 'Latest in tech, AI, and innovation' },
  business: { icon: '📈', label: 'Business', desc: 'Markets, economy, and entrepreneurship' },
  entertainment: { icon: '🎬', label: 'Entertainment', desc: 'Movies, music, and pop culture' },
  health: { icon: '❤️', label: 'Health', desc: 'Medical research and wellness news' },
  science: { icon: '🔬', label: 'Science', desc: 'Scientific discoveries and research' },
  sports: { icon: '⚽', label: 'Sports', desc: 'Sports news and match highlights' },
};

const CategoryPage = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const meta = CATEGORY_META[category] || { icon: '📰', label: category, desc: `Latest ${category} news` };

  const fetchNews = async (pg = 1, append = false) => {
    if (pg === 1) setLoading(true);
    setError(null);
    try {
      const { data } = await newsAPI.getHeadlines({ category, page: pg, pageSize: 12 });
      const articles = data.articles || [];
      setArticles(prev => append ? [...prev, ...articles] : articles);
      setHasMore(articles.length === 12);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchNews(1);
  }, [category]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl">{meta.icon}</span>
            <div>
              <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white capitalize">
                {meta.label}
              </h1>
              <p className="text-ink-500 dark:text-ink-400">{meta.desc}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid count={12} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-ink-600 dark:text-ink-400">{error}</p>
            <button onClick={() => fetchNews(1)} className="btn-primary">
              <FiRefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {articles.map((article, i) => (
                <div key={article.articleId || i} className="animate-slide-up" style={{ animationDelay: `${(i % 8) * 50}ms` }}>
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-10">
                <button onClick={() => { const next = page + 1; setPage(next); fetchNews(next, true); }}
                  className="btn-secondary">Load More</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
