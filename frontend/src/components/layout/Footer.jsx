import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiGithub, FiTwitter } from 'react-icons/fi';

const Footer = () => (
  <footer className="mt-20 border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <FiZap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-ink-900 dark:text-white">
            News<span className="text-brand-500">Lens</span>
          </span>
        </div>
        <p className="text-sm text-ink-500 dark:text-ink-400 text-center">
          AI-powered news summaries. Stay informed, read smarter.
        </p>
        <div className="flex items-center gap-4 text-sm text-ink-500 dark:text-ink-400">
          <Link to="/category/technology" className="hover:text-brand-500 transition-colors">Tech</Link>
          <Link to="/category/business" className="hover:text-brand-500 transition-colors">Business</Link>
          <Link to="/category/science" className="hover:text-brand-500 transition-colors">Science</Link>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-ink-100 dark:border-ink-800 text-center">
        <p className="text-xs text-ink-400 dark:text-ink-500">
          © {new Date().getFullYear()} NewsLens. Built with React, Node.js, MongoDB & AI.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
