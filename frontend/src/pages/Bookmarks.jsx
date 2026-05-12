import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../hooks/useBookmarks';
import NewsCard from '../components/news/NewsCard';
import { FiBookmark, FiSearch, FiTrash2 } from 'react-icons/fi';

const Bookmarks = () => {
  const { bookmarks } = useBookmarks();
  const [search, setSearch] = useState('');

  const filtered = bookmarks.filter(b =>
    !search || b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white flex items-center gap-3">
              <FiBookmark className="w-7 h-7 text-brand-500" />
              My Bookmarks
            </h1>
            <p className="text-ink-500 dark:text-ink-400 mt-1">
              {bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}
            </p>
          </div>
          {bookmarks.length > 0 && (
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter bookmarks..."
                className="input-field pl-9 text-sm py-2"
              />
            </div>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-ink-100 dark:bg-ink-800 rounded-full flex items-center justify-center">
              <FiBookmark className="w-9 h-9 text-ink-300 dark:text-ink-600" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink-700 dark:text-ink-300 mb-3">No bookmarks yet</h2>
            <p className="text-ink-500 dark:text-ink-400 mb-6 max-w-sm mx-auto">
              Save articles you want to read later by clicking the bookmark icon on any article.
            </p>
            <Link to="/" className="btn-primary">Browse News</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-ink-500">No bookmarks match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((article, i) => (
              <div key={article.articleId || i}
                className="animate-slide-up"
                style={{ animationDelay: `${(i % 8) * 50}ms` }}>
                <NewsCard article={{
                  ...article,
                  source: typeof article.source === 'string' ? { name: article.source } : article.source
                }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
