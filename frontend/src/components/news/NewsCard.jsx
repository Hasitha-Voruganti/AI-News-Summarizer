import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiBookmark, FiClock, FiExternalLink, FiShare2 } from 'react-icons/fi';
import { useBookmarks } from '../../hooks/useBookmarks';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  technology: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  business: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  science: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  health: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  sports: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  general: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400',
};

const NewsCard = ({ article, style = 'default' }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [imgError, setImgError] = useState(false);
  const bookmarked = isBookmarked(article.articleId);
  const categoryColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general;

  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : '';

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url: article.url });
      } else {
        await navigator.clipboard.writeText(article.url);
        toast.success('Link copied!');
      }
    } catch {}
  };

  const articleState = {
    articleId: article.articleId,
    title: article.title,
    description: article.description,
    url: article.url,
    urlToImage: article.urlToImage,
    source: typeof article.source === 'object' ? article.source?.name : article.source,
    publishedAt: article.publishedAt,
    category: article.category,
    content: article.content,
    author: article.author,
  };

  if (style === 'featured') {
    return (
      <Link to={`/article/${article.articleId}`} state={{ article: articleState }}
        className="group block card overflow-hidden hover:-translate-y-1 transition-all duration-300">
        <div className="md:flex">
          <div className="md:w-1/2 relative overflow-hidden">
            {article.urlToImage && !imgError ? (
              <img src={article.urlToImage} alt={article.title}
                onError={() => setImgError(true)}
                className="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-56 md:h-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center">
                <span className="text-4xl">📰</span>
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`badge ${categoryColor} capitalize`}>{article.category || 'general'}</span>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.preventDefault(); toggleBookmark(articleState); }}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${bookmarked ? 'text-brand-500' : 'text-ink-400 hover:text-brand-500'}`}>
                    <FiBookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={handleShare}
                    className="p-1.5 rounded-lg text-ink-400 hover:text-brand-500 transition-colors">
                    <FiShare2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-3 line-clamp-3 group-hover:text-brand-600 transition-colors">
                {article.title}
              </h2>
              <p className="text-sm text-ink-600 dark:text-ink-400 line-clamp-2">{article.description}</p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100 dark:border-ink-800">
              <div className="text-xs text-ink-500">
                <span className="font-medium">{typeof article.source === 'object' ? article.source?.name : article.source}</span>
                {timeAgo && <span> · {timeAgo}</span>}
              </div>
              <span className="text-xs text-brand-500 font-medium">Read more →</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.articleId}`} state={{ article: articleState }}
      className="group block card overflow-hidden hover:-translate-y-1 transition-all duration-300">
      <div className="relative overflow-hidden">
        {article.urlToImage && !imgError ? (
          <img src={article.urlToImage} alt={article.title}
            onError={() => setImgError(true)}
            className="news-card-image group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 flex items-center justify-center rounded-t-2xl">
            <span className="text-3xl">📰</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`badge ${categoryColor} capitalize shadow-sm`}>{article.category || 'general'}</span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggleBookmark(articleState); }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-sm transition-all duration-200 ${
            bookmarked
              ? 'bg-brand-500 text-white shadow-glow'
              : 'bg-white/80 dark:bg-ink-900/80 text-ink-600 dark:text-ink-400 hover:bg-brand-500 hover:text-white'
          }`}
        >
          <FiBookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-ink-900 dark:text-white line-clamp-2 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="text-sm text-ink-500 dark:text-ink-400 line-clamp-2 mb-3">{article.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-ink-400">
            <FiClock className="w-3 h-3" />
            <span>{timeAgo || 'Recently'}</span>
          </div>
          <span className="text-xs font-medium text-ink-500 dark:text-ink-400 truncate max-w-24">
            {typeof article.source === 'object' ? article.source?.name : article.source}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
