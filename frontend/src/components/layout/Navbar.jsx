import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiSun, FiMoon, FiSearch, FiBookmark, FiUser,
  FiMenu, FiX, FiLogOut, FiSettings, FiClock, FiZap
} from 'react-icons/fi';

const CATEGORIES = ['general', 'technology', 'business', 'health', 'science', 'sports', 'entertainment'];

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-sm border-b border-ink-100/80 dark:border-ink-800/80' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-glow transition-all duration-300">
              <FiZap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-ink-900 dark:text-white">
              News<span className="text-brand-500">Lens</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {CATEGORIES.slice(0, 5).map(cat => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  location.pathname === `/category/${cat}`
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400'
                    : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="pl-9 pr-4 py-2 text-sm bg-ink-100 dark:bg-ink-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 w-44 focus:w-56 transition-all duration-300 text-ink-900 dark:text-ink-100 placeholder-ink-400"
                />
              </div>
            </form>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {token ? (
              <>
                {/* Bookmarks */}
                <Link
                  to="/bookmarks"
                  className="hidden sm:flex p-2 rounded-xl text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-brand-500 transition-all duration-200"
                >
                  <FiBookmark className="w-5 h-5" />
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-ink-700 dark:text-ink-300 max-w-20 truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 card border border-ink-100 dark:border-ink-800 py-1 animate-fade-in">
                      <div className="px-4 py-3 border-b border-ink-100 dark:border-ink-800">
                        <p className="font-semibold text-ink-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-ink-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                        <FiUser className="w-4 h-4" /> Profile & Settings
                      </Link>
                      <Link to="/bookmarks" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                        <FiBookmark className="w-4 h-4" /> My Bookmarks
                      </Link>
                      <Link to="/history" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                        <FiClock className="w-4 h-4" /> Reading History
                      </Link>
                      <div className="divider my-1" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2 px-3">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-ink-100 dark:border-ink-800 py-3 space-y-1 animate-slide-up">
            <form onSubmit={handleSearch} className="px-2 pb-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="input-field pl-9 text-sm"
                />
              </div>
            </form>
            {CATEGORIES.map(cat => (
              <Link key={cat} to={`/category/${cat}`}
                className="block px-4 py-2.5 text-sm font-medium capitalize text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors">
                {cat}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
