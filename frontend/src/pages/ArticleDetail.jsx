import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiArrowLeft, FiExternalLink, FiBookmark, FiShare2, FiClock, FiUser } from 'react-icons/fi';
import AISummary from '../components/news/AISummary';
import { useBookmarks } from '../hooks/useBookmarks';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { token } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [imgError, setImgError] = useState(false);

  const article = location.state?.article;
  const bookmarked = article ? isBookmarked(article.articleId) : false;

  useEffect(() => {
    window.scrollTo(0, 0);

    if (article && token) {
      userAPI.addToHistory({
        articleId: article.articleId,
        title: article.title,
        url: article.url,
        urlToImage: article.urlToImage,
        source: article.source,
      }).catch(() => {});
    }
  }, [article, token]);

  if (!article) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-6">
        <p className="text-4xl">🔍</p>
        <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Article not found</h2>
        <p className="text-ink-500">The article you're looking for isn't available.</p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    );
  }

  const publishedDate = article.publishedAt
    ? format(new Date(article.publishedAt), 'MMMM d, yyyy · h:mm a')
    : null;

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <button onClick={() => window.history.back()}
          className="btn-ghost mt-6 mb-6 -ml-2">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Category */}
        <div className="mb-4">
          <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400 capitalize">
            {article.category || 'news'}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-white leading-tight mb-5">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-ink-100 dark:border-ink-800">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <div className="w-6 h-6 rounded-full bg-ink-200 dark:bg-ink-700 flex items-center justify-center">
              <FiUser className="w-3 h-3" />
            </div>
            <span>{article.author || article.source || 'Unknown'}</span>
          </div>
          {publishedDate && (
            <div className="flex items-center gap-1.5 text-sm text-ink-500">
              <FiClock className="w-3.5 h-3.5" />
              <span>{publishedDate}</span>
            </div>
          )}
          {article.source && typeof article.source === 'string' && (
            <span className="text-sm font-medium text-ink-600 dark:text-ink-400">
              {article.source}
            </span>
          )}

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(article)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                bookmarked
                  ? 'bg-brand-500 text-white'
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:bg-brand-100 hover:text-brand-600'
              }`}
            >
              <FiBookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Saved' : 'Save'}
            </button>
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:bg-brand-100 hover:text-brand-600 transition-all duration-200">
              <FiExternalLink className="w-4 h-4" /> Full Article
            </a>
          </div>
        </div>

        {/* Image */}
        {article.urlToImage && !imgError && (
          <div className="rounded-2xl overflow-hidden mb-6 shadow-card">
            <img
              src={article.urlToImage}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Description */}
        {article.description && (
          <p className="text-lg text-ink-700 dark:text-ink-300 leading-relaxed mb-6 font-medium">
            {article.description}
          </p>
        )}

        {/* Content */}
        {article.content && (
          <div className="prose prose-ink dark:prose-invert max-w-none mb-6">
            <p className="text-ink-700 dark:text-ink-300 leading-relaxed">
              {article.content.replace(/\[\+\d+ chars\]$/, '')}
            </p>
          </div>
        )}

        {/* Read Full Article CTA */}
        <div className="p-5 rounded-2xl bg-ink-50 dark:bg-ink-800/50 border border-ink-100 dark:border-ink-800 mb-6">
          <p className="text-sm text-ink-600 dark:text-ink-400 mb-3">
            This is a preview. Read the complete article on the original source.
          </p>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
            <FiExternalLink className="w-4 h-4" />
            Read Full Article on {typeof article.source === 'string' ? article.source : article.source?.name || 'Source'}
          </a>
        </div>

        {/* AI Summary */}
        <AISummary article={article} />
      </div>
    </div>
  );
};

export default ArticleDetail;
