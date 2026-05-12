import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { newsAPI } from '../services/api';
import NewsCard from '../components/news/NewsCard';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'Latest' },
  { value: 'relevancy', label: 'Relevancy' },
  { value: 'popularity', label: 'Popularity' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [page, setPage] = useState(1);

  const search = useCallback(async (q, sort, pg = 1, append = false) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await newsAPI.search({ q, sortBy: sort, page: pg, pageSize: 12 });
      setArticles(prev => append ? [...prev, ...(data.articles || [])] : (data.articles || []));
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      setInputValue(query);
      setPage(1);
      search(query, sortBy, 1);
    }
  }, [query, sortBy, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim().length >= 2) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    search(query, sortBy, next, true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white mb-6">
            Search News
          </h1>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Search for news, topics, events..."
                className="input-field pl-12 text-base"
                autoFocus
              />
              {inputValue && (
                <button type="button" onClick={() => setInputValue('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
          </form>
        </div>

        {/* Results Info & Sort */}
        {query && !loading && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-sm text-ink-600 dark:text-ink-400">
              {totalResults > 0
                ? <><span className="font-semibold text-ink-900 dark:text-white">{totalResults.toLocaleString()}</span> results for "<span className="text-brand-600 dark:text-brand-400">{query}</span>"</>
                : `No results for "${query}"`
              }
            </p>
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-ink-400" />
              <span className="text-sm text-ink-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400 text-ink-700 dark:text-ink-300"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content */}
        {!query ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="font-display text-2xl font-semibold text-ink-700 dark:text-ink-300 mb-2">
              Search for any news topic
            </h2>
            <p className="text-ink-500">Try "climate change", "technology", "elections"...</p>
          </div>
        ) : loading && articles.length === 0 ? (
          <SkeletonGrid count={12} />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-ink-600 dark:text-ink-400 mb-4">{error}</p>
            <button onClick={() => search(query, sortBy, 1)} className="btn-primary">Retry</button>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-display text-xl font-semibold text-ink-700 dark:text-ink-300 mb-2">No results found</h2>
            <p className="text-ink-500">Try different keywords or check your spelling</p>
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
            {articles.length < totalResults && (
              <div className="text-center mt-10">
                <button onClick={loadMore} disabled={loading} className="btn-secondary">
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
