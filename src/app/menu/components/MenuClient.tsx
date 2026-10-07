'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import MenuCategoryTabs from './MenuCategoryTabs';
import type { MenuCategory, MenuItem } from '@/lib/menu-types';

interface MenuResponse {
  categories: MenuCategory[];
  items: MenuItem[];
}

const dietaryFilters = [
  { id: 'filter-vegan', slug: 'vegan', label: 'Vegan' },
  { id: 'filter-vegetarian', slug: 'vegetarian', label: 'Vegetarian' },
  { id: 'filter-spicy', slug: 'spicy', label: 'Spicy' },
];

export default function MenuClient() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDietaryFilters, setActiveDietaryFilters] = useState<string[]>([]);
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/menu', { signal: controller.signal });
        const result = (await response.json()) as MenuResponse | { error?: string };
        if (!response.ok || !('items' in result)) {
          throw new Error('error' in result ? result.error : 'Menu data is unavailable.');
        }
        setItems(result.items);
        setCategories(result.categories);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Menu data is temporarily unavailable.'
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadMenu();
    return () => controller.abort();
  }, []);

  const toggleDietaryFilter = (slug: string) => {
    setActiveDietaryFilters((previous) =>
      previous.includes(slug) ? previous.filter((filter) => filter !== slug) : [...previous, slug]
    );
  };

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesCategory = activeCategory === 'all' || item.categorySlug === activeCategory;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);
        const matchesDietary =
          activeDietaryFilters.length === 0 ||
          activeDietaryFilters.every((filter) => item.tags.includes(filter));
        return (
          matchesCategory && matchesSearch && matchesDietary && (showUnavailable || item.available)
        );
      }),
    [items, activeCategory, searchQuery, activeDietaryFilters, showUnavailable]
  );

  const tabs = [
    { id: 'cat-all', slug: 'all', label: 'All Items' },
    ...categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      label: category.name,
    })),
  ];
  const featuredCount = filteredItems.filter((item) => item.featured).length;
  const counts = Object.fromEntries(
    tabs.map((category) => [
      category.slug,
      category.slug === 'all'
        ? items.length
        : items.filter((item) => item.categorySlug === category.slug).length,
    ])
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            aria-label="Search menu items"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {dietaryFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={activeDietaryFilters.includes(filter.slug)}
              onClick={() => toggleDietaryFilter(filter.slug)}
              className={`text-xs font-600 px-3 py-2 rounded-xl border transition-all duration-150 ${
                activeDietaryFilters.includes(filter.slug)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
              }`}
            >
              {filter.label}
            </button>
          ))}

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showUnavailable}
              onChange={(event) => setShowUnavailable(event.target.checked)}
              className="w-3.5 h-3.5 accent-primary"
            />
            Show unavailable
          </label>
        </div>
      </div>

      {categories.length > 0 && (
        <MenuCategoryTabs
          categories={tabs}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          counts={counts}
        />
      )}

      {loading ? (
        <div role="status" aria-label="Loading menu items" className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div key={item} aria-hidden="true" className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
              <div className="h-44 bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-10 w-full rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div role="alert" className="py-20 text-center">
          <h2 className="font-700 text-foreground">Menu unavailable</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5 mt-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-700 text-foreground">{filteredItems.length}</span> items
              {searchQuery && (
                <span>
                  {' '}
                  for &quot;<span className="text-primary font-600">{searchQuery}</span>&quot;
                </span>
              )}
            </p>
            {featuredCount > 0 && (
              <p className="text-xs text-accent font-600">{featuredCount} featured</p>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search size={22} className="text-muted-foreground" />
              </div>
              <h3 className="font-700 text-foreground mb-1">
                {items.length === 0 ? 'No menu items yet' : 'No items found'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {items.length === 0
                  ? 'Menu items will appear here once they have been added.'
                  : 'Try adjusting your search or removing dietary filters.'}
              </p>
              {items.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveDietaryFilters([]);
                    setActiveCategory('all');
                  }}
                  className="text-primary font-600 text-sm hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
