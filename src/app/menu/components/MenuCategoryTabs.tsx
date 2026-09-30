'use client';

import React, { useRef } from 'react';

interface Category {
  id: string;
  slug: string;
  label: string;
}

interface MenuCategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  counts: Record<string, number>;
}

export default function MenuCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  counts,
}: MenuCategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 border-b border-border"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.slug)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-600 rounded-xl whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
            activeCategory === cat.slug
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          {cat.label}
          <span
            className={`text-xs font-700 px-1.5 py-0.5 rounded-full font-mono-data ${
              activeCategory === cat.slug
                ? 'bg-white/20 text-white' :'bg-muted text-muted-foreground'
            }`}
          >
            {counts[cat.slug] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}