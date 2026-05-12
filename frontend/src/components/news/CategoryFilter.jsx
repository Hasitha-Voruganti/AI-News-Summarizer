import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CATEGORY_ICONS = {
  general: '🌐', technology: '💻', business: '📈',
  entertainment: '🎬', health: '❤️', science: '🔬', sports: '⚽'
};

const CATEGORY_COLORS = {
  general: 'from-ink-400 to-ink-600',
  technology: 'from-blue-400 to-blue-600',
  business: 'from-green-400 to-green-600',
  entertainment: 'from-pink-400 to-pink-600',
  health: 'from-red-400 to-red-600',
  science: 'from-purple-400 to-purple-600',
  sports: 'from-yellow-400 to-yellow-600',
};

const CategoryFilter = ({ categories, activeCategory, onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <button onClick={() => scroll(-1)}
        className="flex-shrink-0 p-1.5 rounded-full bg-white dark:bg-ink-800 shadow-sm border border-ink-100 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:text-brand-500 transition-colors">
        <FiChevronLeft className="w-4 h-4" />
      </button>

      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button
          onClick={() => onSelect('all')}
          className={`category-pill flex-shrink-0 ${
            activeCategory === 'all'
              ? 'bg-brand-500 text-white'
              : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:bg-ink-200 dark:hover:bg-ink-700'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`category-pill flex-shrink-0 flex items-center gap-1.5 ${
              activeCategory === cat
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 hover:bg-ink-200 dark:hover:bg-ink-700'
            }`}
          >
            <span className="text-sm">{CATEGORY_ICONS[cat] || '📰'}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      <button onClick={() => scroll(1)}
        className="flex-shrink-0 p-1.5 rounded-full bg-white dark:bg-ink-800 shadow-sm border border-ink-100 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:text-brand-500 transition-colors">
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CategoryFilter;
