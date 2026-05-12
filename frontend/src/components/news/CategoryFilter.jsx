import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CATEGORY_ICONS = {
  general: "🌐",
  technology: "💻",
  business: "📈",
  entertainment: "🎬",
  health: "❤️",
  science: "🔬",
  sports: "⚽",
};

const CategoryFilter = ({ categories, activeCategory, onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Left scroll button */}
      <button
        onClick={() => scroll(-1)}
        className="flex-shrink-0 p-1.5 rounded-full bg-white dark:bg-ink-600 shadow-sm border border-ink-200 dark:border-ink-500 text-ink-700 dark:text-white hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable pills */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
              activeCategory === cat
                ? "bg-brand-500 text-white shadow-md ring-2 ring-brand-400/40"
                : "bg-ink-200 dark:bg-ink-600 text-ink-900 dark:text-white hover:bg-ink-300 dark:hover:bg-ink-500 border border-transparent dark:border-ink-400"
            }`}
          >
            <span className="text-sm leading-none">
              {CATEGORY_ICONS[cat] || "📰"}
            </span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll(1)}
        className="flex-shrink-0 p-1.5 rounded-full bg-white dark:bg-ink-600 shadow-sm border border-ink-200 dark:border-ink-500 text-ink-700 dark:text-white hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CategoryFilter;
