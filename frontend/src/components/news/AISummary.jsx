import React, { useState } from 'react';
import { aiAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiZap, FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SENTIMENT_CONFIG = {
  positive: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '↑', label: 'Positive' },
  negative: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '↓', label: 'Negative' },
  neutral: { color: 'text-ink-600 dark:text-ink-400', bg: 'bg-ink-100 dark:bg-ink-800', icon: '→', label: 'Neutral' },
};

const AISummary = ({ article }) => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  const generateSummary = async () => {
    if (!token) {
      toast.error('Please sign in to use AI summaries');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await aiAPI.summarize({
        articleId: article.articleId,
        title: article.title,
        content: article.content,
        description: article.description,
        url: article.url,
      });
      setSummary(data.summary);
      setExpanded(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate summary';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const sentiment = summary ? SENTIMENT_CONFIG[summary.sentiment] || SENTIMENT_CONFIG.neutral : null;

  if (!token) {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
        <div className="flex items-center gap-2 mb-2">
          <FiZap className="w-4 h-4 text-brand-500" />
          <span className="font-semibold text-brand-700 dark:text-brand-400">AI Summary</span>
        </div>
        <p className="text-sm text-ink-600 dark:text-ink-400 mb-3">
          Sign in to get instant AI-powered summaries of any article.
        </p>
        <Link to="/login" className="btn-primary text-sm py-2">Sign In to Summarize</Link>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-brand-200 dark:border-brand-800 overflow-hidden">
      <div
        className={`flex items-center justify-between p-4 cursor-pointer ${
          summary ? 'bg-brand-50 dark:bg-brand-900/20' : 'bg-ink-50 dark:bg-ink-800/50'
        } transition-colors`}
        onClick={() => summary ? setExpanded(!expanded) : generateSummary()}
      >
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            summary ? 'bg-brand-500' : 'bg-ink-200 dark:bg-ink-700'
          }`}>
            {loading ? (
              <FiLoader className="w-3.5 h-3.5 text-white animate-spin" />
            ) : (
              <FiZap className={`w-3.5 h-3.5 ${summary ? 'text-white' : 'text-ink-500 dark:text-ink-400'}`} />
            )}
          </div>
          <div>
            <span className="font-semibold text-ink-900 dark:text-white text-sm">
              {loading ? 'Generating AI Summary...' : summary ? 'AI Summary' : 'Generate AI Summary'}
            </span>
            {summary?.provider && (
              <span className="ml-2 text-xs text-ink-400 dark:text-ink-500">
                via {summary.provider === 'mock' ? 'Demo' : summary.provider}
              </span>
            )}
          </div>
        </div>
        {summary && (expanded ? <FiChevronUp className="w-4 h-4 text-ink-500" /> : <FiChevronDown className="w-4 h-4 text-ink-500" />)}
        {!summary && !loading && (
          <span className="text-xs bg-brand-500 text-white px-2 py-1 rounded-lg font-medium">Try it</span>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={generateSummary} className="text-sm text-brand-500 hover:underline mt-1">Retry</button>
        </div>
      )}

      {summary && expanded && (
        <div className="p-4 bg-white dark:bg-ink-900 border-t border-brand-100 dark:border-brand-900 animate-fade-in">
          {/* Sentiment & Reading Time */}
          <div className="flex items-center gap-3 mb-4">
            {sentiment && (
              <span className={`badge ${sentiment.bg} ${sentiment.color} font-medium`}>
                {sentiment.icon} {sentiment.label} tone
              </span>
            )}
            {summary.readingTime && (
              <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400">
                ~{summary.readingTime} min read
              </span>
            )}
          </div>

          {/* Summary */}
          <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed mb-4 font-sans">
            {summary.summary}
          </p>

          {/* Key Points */}
          {summary.keyPoints && summary.keyPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">Key Points</h4>
              <ul className="space-y-2">
                {summary.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-300">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISummary;
