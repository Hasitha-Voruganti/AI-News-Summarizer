import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { FiClock, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    userAPI.getHistory()
      .then(({ data }) => setHistory(data.history || []))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const clearHistory = async () => {
    if (!window.confirm('Clear all reading history?')) return;
    setClearing(true);
    try {
      await userAPI.clearHistory();
      setHistory([]);
      toast.success('History cleared');
    } catch {
      toast.error('Failed to clear history');
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white flex items-center gap-3">
              <FiClock className="w-7 h-7 text-brand-500" />
              Reading History
            </h1>
            <p className="text-ink-500 dark:text-ink-400 mt-1">
              {history.length} article{history.length !== 1 ? 's' : ''} read
            </p>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} disabled={clearing}
              className="btn-ghost text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <FiTrash2 className="w-4 h-4" />
              {clearing ? 'Clearing...' : 'Clear All'}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-ink-100 dark:bg-ink-800 rounded-full flex items-center justify-center">
              <FiClock className="w-9 h-9 text-ink-300 dark:text-ink-600" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink-700 dark:text-ink-300 mb-3">No history yet</h2>
            <p className="text-ink-500 mb-6">Articles you read will appear here.</p>
            <Link to="/" className="btn-primary">Start Reading</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <div key={i}
                className="card p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}>
                {item.urlToImage ? (
                  <img src={item.urlToImage} alt=""
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-ink-100 dark:bg-ink-800"
                    onError={e => e.target.style.display = 'none'} />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-ink-100 dark:bg-ink-800 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xl">📰</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink-900 dark:text-white line-clamp-2 text-sm leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-ink-400">
                      {item.source}
                    </span>
                    <span className="text-xs text-ink-300 dark:text-ink-600">·</span>
                    <span className="text-xs text-ink-400">
                      {item.readAt ? formatDistanceToNow(new Date(item.readAt), { addSuffix: true }) : ''}
                    </span>
                  </div>
                </div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
