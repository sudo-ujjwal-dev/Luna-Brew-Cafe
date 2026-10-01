'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import MenuCategoryTabs from './MenuCategoryTabs';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
  available: boolean;
  featured: boolean;
  tags: string[];
}

// Backend integration point: replace with fetch('/api/menu-items')
const allMenuItems: MenuItem[] = [
  {
    id: 'item-001',
    name: 'Luna Signature Espresso',
    description:
      'Double-shot Ethiopian Yirgacheffe with notes of dark chocolate, citrus zest, and a lingering floral finish. Our most popular coffee.',
    price: 180,
    category: 'Coffee',
    categorySlug: 'coffee',
    image: 'https://images.unsplash.com/photo-1606168347215-38903eb09e0a',
    imageAlt: 'Artisan espresso in a ceramic cup with golden crema swirls on a wooden saucer',
    available: true,
    featured: true,
    tags: ['vegan'],
  },
  {
    id: 'item-002',
    name: 'Flat White',
    description:
      'Ristretto espresso base with velvety microfoam milk. Rich, smooth, and perfectly balanced with a subtle sweetness.',
    price: 240,
    category: 'Coffee',
    categorySlug: 'coffee',
    image: 'https://images.unsplash.com/photo-1576881695660-f5fb8e04b7c0',
    imageAlt: 'Flat white coffee in a small white ceramic cup with smooth latte art on top',
    available: true,
    featured: false,
    tags: ['vegetarian'],
  },
  {
    id: 'item-003',
    name: 'Oat Milk Cappuccino',
    description:
      'Classic cappuccino made with locally roasted Colombian beans and creamy organic oat milk. Dairy-free without compromise.',
    price: 280,
    category: 'Coffee',
    categorySlug: 'coffee',
    image: 'https://images.unsplash.com/photo-1617006898158-450d77727ed9',
    imageAlt: 'Cappuccino with thick foam and cocoa dusting in a wide ceramic mug',
    available: true,
    featured: false,
    tags: ['vegan', 'dairy-free'],
  },
  {
    id: 'item-004',
    name: 'Matcha Latte',
    description:
      'Ceremonial grade Japanese matcha whisked with organic oat milk and a touch of raw honey. Earthy, creamy, and calming.',
    price: 350,
    category: 'Tea',
    categorySlug: 'tea',
    image: 'https://images.unsplash.com/photo-1645871932206-5bb02c38b425',
    imageAlt: 'Vibrant green matcha latte in a ceramic mug with delicate latte art on top',
    available: true,
    featured: true,
    tags: ['vegan', 'dairy-free'],
  },
  {
    id: 'item-005',
    name: 'Chamomile & Honey',
    description:
      'Premium loose-leaf chamomile steeped for 5 minutes, served with wildflower honey and a slice of lemon.',
    price: 220,
    category: 'Tea',
    categorySlug: 'tea',
    image: 'https://images.unsplash.com/photo-1645871932206-5bb02c38b425',
    imageAlt: 'Glass teapot with golden chamomile tea and lemon slice on a white saucer',
    available: true,
    featured: false,
    tags: ['vegan', 'gf'],
  },
  {
    id: 'item-006',
    name: 'Cold Brew Float',
    description:
      'Slow-steeped 18-hour cold brew topped with vanilla bean ice cream and salted caramel drizzle. A dessert in a glass.',
    price: 380,
    category: 'Cold Drinks',
    categorySlug: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1658057542688-e32ef3883c85',
    imageAlt:
      'Tall glass of dark cold brew coffee with a scoop of vanilla ice cream and caramel drizzle',
    available: true,
    featured: true,
    tags: ['vegetarian'],
  },
  {
    id: 'item-007',
    name: 'Mango Hibiscus Cooler',
    description:
      'Freshly blended Alphonso mango with hibiscus tea, lime juice, and sparkling water. Refreshing and naturally vibrant.',
    price: 320,
    category: 'Cold Drinks',
    categorySlug: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1658057542688-e32ef3883c85',
    imageAlt: 'Tall glass of vibrant orange mango drink with hibiscus garnish and ice cubes',
    available: true,
    featured: false,
    tags: ['vegan', 'gf'],
  },
  {
    id: 'item-008',
    name: 'Avocado Toast Deluxe',
    description:
      'Toasted sourdough with smashed Hass avocado, two poached eggs, chili flakes, lemon zest, and microgreens.',
    price: 480,
    category: 'Breakfast',
    categorySlug: 'breakfast',
    image: 'https://images.unsplash.com/photo-1657373372123-82faeea24455',
    imageAlt:
      'Thick sourdough toast topped with vibrant green avocado, perfectly poached egg, and microgreens',
    available: true,
    featured: true,
    tags: ['vegetarian'],
  },
  {
    id: 'item-009',
    name: 'Luna Full Breakfast',
    description:
      'Two free-range eggs any style, smoked back bacon, grilled tomato, sautéed mushrooms, baked beans, and sourdough toast.',
    price: 620,
    category: 'Breakfast',
    categorySlug: 'breakfast',
    image: 'https://images.unsplash.com/photo-1657373372123-82faeea24455',
    imageAlt:
      'Full breakfast plate with eggs, bacon, tomatoes, mushrooms, and toast on a white ceramic plate',
    available: true,
    featured: false,
    tags: [],
  },
  {
    id: 'item-010',
    name: 'Truffle Mushroom Risotto',
    description:
      'Slow-stirred arborio rice with wild mushroom medley, black truffle oil, aged parmesan, and fresh thyme.',
    price: 780,
    category: 'Main Meals',
    categorySlug: 'main-meals',
    image: 'https://images.unsplash.com/photo-1724116380653-a5371c60944a',
    imageAlt: 'Creamy mushroom risotto in a wide white bowl with truffle shavings and fresh thyme',
    available: true,
    featured: true,
    tags: ['vegetarian', 'gf'],
  },
  {
    id: 'item-011',
    name: 'Grilled Salmon Plate',
    description:
      'Atlantic salmon fillet with herb butter, roasted asparagus, lemon caper sauce, and crushed new potatoes.',
    price: 900,
    category: 'Main Meals',
    categorySlug: 'main-meals',
    image: 'https://images.unsplash.com/photo-1662721844198-1e6bcf29f932',
    imageAlt:
      'Grilled salmon fillet with golden crust, green asparagus, and lemon sauce on a white plate',
    available: false,
    featured: false,
    tags: ['gf'],
  },
  {
    id: 'item-012',
    name: 'Lemon Tart',
    description:
      'Crumbly butter pastry shell filled with silky house-made lemon curd, topped with torched Italian meringue.',
    price: 320,
    category: 'Desserts',
    categorySlug: 'desserts',
    image: 'https://images.unsplash.com/photo-1622219457433-4a05f8bf19c1',
    imageAlt:
      'Elegant lemon tart with perfectly torched golden meringue peaks on a white ceramic plate',
    available: true,
    featured: false,
    tags: ['vegetarian'],
  },
];

const categories = [
  { id: 'cat-all', slug: 'all', label: 'All Items' },
  { id: 'cat-coffee', slug: 'coffee', label: 'Coffee' },
  { id: 'cat-tea', slug: 'tea', label: 'Tea' },
  { id: 'cat-cold-drinks', slug: 'cold-drinks', label: 'Cold Drinks' },
  { id: 'cat-breakfast', slug: 'breakfast', label: 'Breakfast' },
  { id: 'cat-main-meals', slug: 'main-meals', label: 'Main Meals' },
  { id: 'cat-desserts', slug: 'desserts', label: 'Desserts' },
];

const dietaryFilters = [
  { id: 'filter-vegan', slug: 'vegan', label: 'Vegan' },
  { id: 'filter-gf', slug: 'gf', label: 'Gluten-Free' },
  { id: 'filter-dairy-free', slug: 'dairy-free', label: 'Dairy-Free' },
];

export default function MenuClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDietaryFilters, setActiveDietaryFilters] = useState<string[]>([]);
  const [showUnavailable, setShowUnavailable] = useState(true);

  const toggleDietaryFilter = (slug: string) => {
    setActiveDietaryFilters((prev) =>
      prev.includes(slug) ? prev.filter((f) => f !== slug) : [...prev, slug]
    );
  };

  const filteredItems = useMemo(() => {
    return allMenuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.categorySlug === activeCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDietary =
        activeDietaryFilters.length === 0 ||
        activeDietaryFilters.every((f) => item.tags.includes(f));
      const matchesAvailability = showUnavailable || item.available;
      return matchesCategory && matchesSearch && matchesDietary && matchesAvailability;
    });
  }, [activeCategory, searchQuery, activeDietaryFilters, showUnavailable]);

  const featuredCount = filteredItems.filter((i) => i.featured).length;

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search + filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              onChange={(e) => setShowUnavailable(e.target.checked)}
              className="w-3.5 h-3.5 accent-primary"
            />
            Show unavailable
          </label>
        </div>
      </div>

      {/* Category tabs */}
      <MenuCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        counts={Object.fromEntries(
          categories.map((c) => [
            c.slug,
            c.slug === 'all'
              ? allMenuItems.length
              : allMenuItems.filter((i) => i.categorySlug === c.slug).length,
          ])
        )}
      />

      {/* Results info */}
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

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search size={22} className="text-muted-foreground" />
          </div>
          <h3 className="font-700 text-foreground mb-1">No items found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search or removing dietary filters.
          </p>
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
