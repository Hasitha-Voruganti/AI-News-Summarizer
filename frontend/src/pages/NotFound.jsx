import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <p className="text-8xl mb-6 animate-bounce">📰</p>
    <h1 className="font-display text-5xl font-bold text-ink-900 dark:text-white mb-3">404</h1>
    <h2 className="font-display text-2xl font-semibold text-ink-700 dark:text-ink-300 mb-4">Page not found</h2>
    <p className="text-ink-500 dark:text-ink-400 max-w-sm mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex gap-3">
      <button onClick={() => window.history.back()} className="btn-secondary">Go Back</button>
      <Link to="/" className="btn-primary">Home</Link>
    </div>
  </div>
);

export default NotFound;
