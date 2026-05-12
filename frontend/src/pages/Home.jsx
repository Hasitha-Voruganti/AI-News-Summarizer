import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { newsAPI } from "../services/api";
import NewsCard from "../components/news/NewsCard";
import CategoryFilter from "../components/news/CategoryFilter";
import { SkeletonGrid } from "../components/common/SkeletonCard";
import {
  FiTrendingUp,
  FiZap,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "general",
  "technology",
  "business",
  "health",
  "science",
  "sports",
  "entertainment",
];

const Home = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("general");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMockData, setIsMockData] = useState(false);

  const fetchNews = useCallback(async (cat, pg = 1, append = false) => {
    if (pg === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const { data } = await newsAPI.getHeadlines({
        category: cat,
        page: pg,
        pageSize: 12,
      });
      const newArticles = data.articles || [];
      setArticles((prev) => (append ? [...prev, ...newArticles] : newArticles));
      setHasMore(
        newArticles.length === 12 && pg * 12 < (data.totalResults || 0),
      );
      setIsMockData(!!data.isMockData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load news");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchNews(activeCategory, 1, false);
  }, [activeCategory, fetchNews]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchNews(activeCategory, next, true);
  };

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-transparent dark:from-brand-950/30 pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-200/20 dark:bg-brand-800/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400 uppercase tracking-wider">
                <FiZap className="w-3 h-3 mr-1 inline" />
                AI-Powered
              </span>
              {isMockData && (
                <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  Demo Mode
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-900 dark:text-white mb-4 leading-tight">
              News that <span className="text-gradient italic">matters</span>,
              <br />
              summarized by AI
            </h1>
            <p className="text-lg text-ink-600 dark:text-ink-400 leading-relaxed">
              {user ? `Welcome back, ${user.name.split(" ")[0]}! ` : ""}
              Stay informed with the latest headlines and get instant AI-powered
              summaries of any article.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid count={12} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <FiAlertCircle className="w-12 h-12 text-red-400" />
            <p className="text-ink-600 dark:text-ink-400 text-center">
              {error}
            </p>
            <button
              onClick={() => fetchNews(activeCategory, 1)}
              className="btn-primary"
            >
              <FiRefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📰</p>
            <p className="text-ink-500 dark:text-ink-400">
              No articles found for this category.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiTrendingUp className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-semibold text-ink-600 dark:text-ink-400 uppercase tracking-wide">
                    Featured
                  </span>
                </div>
                <NewsCard article={featured} style="featured" />
              </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {rest.map((article, i) => (
                <div
                  key={article.articleId || i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(i % 8) * 50}ms` }}
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-secondary gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-ink-400 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Articles"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
