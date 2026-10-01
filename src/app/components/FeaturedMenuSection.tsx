import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { ArrowRight } from 'lucide-react';

const featuredItems = [
  {
    id: 'item-001',
    name: 'Luna Signature Espresso',
    description: 'Double-shot Ethiopian Yirgacheffe with notes of dark chocolate and citrus zest.',
    price: 180,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1606168347215-38903eb09e0a',
    imageAlt: 'Artisan espresso in a ceramic cup with crema swirls on a wooden saucer',
    tags: ['vegan'],
    featured: true,
  },
  {
    id: 'item-002',
    name: 'Avocado Toast Deluxe',
    description:
      'Sourdough toast with smashed avocado, poached egg, chili flakes, and microgreens.',
    price: 480,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1657373372123-82faeea24455',
    imageAlt:
      'Thick sourdough toast topped with vibrant green avocado, poached egg, and microgreens on a slate plate',
    tags: ['vegetarian'],
    featured: true,
  },
  {
    id: 'item-003',
    name: 'Cold Brew Float',
    description:
      'Slow-steeped 18-hour cold brew topped with vanilla bean ice cream and caramel drizzle.',
    price: 380,
    category: 'Cold Drinks',
    image: 'https://images.unsplash.com/photo-1658057542688-e32ef3883c85',
    imageAlt:
      'Tall glass of dark cold brew coffee with a scoop of vanilla ice cream and caramel drizzle',
    tags: ['vegetarian'],
    featured: true,
  },
  {
    id: 'item-004',
    name: 'Truffle Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms, black truffle oil, and aged parmesan.',
    price: 780,
    category: 'Main Meals',
    image: 'https://images.unsplash.com/photo-1692348023709-47ff577f7277',
    imageAlt: 'Creamy mushroom risotto in a wide white bowl with truffle shavings and fresh herbs',
    tags: ['vegetarian', 'gf'],
    featured: true,
  },
  {
    id: 'item-005',
    name: 'Matcha Latte',
    description: 'Ceremonial grade Japanese matcha whisked with oat milk and a hint of honey.',
    price: 350,
    category: 'Tea',
    image: 'https://images.unsplash.com/photo-1645871932206-5bb02c38b425',
    imageAlt: 'Vibrant green matcha latte in a ceramic mug with latte art on top',
    tags: ['vegan', 'dairy-free'],
    featured: false,
  },
  {
    id: 'item-006',
    name: 'Lemon Tart',
    description: 'Buttery pastry shell filled with silky lemon curd, topped with Italian meringue.',
    price: 320,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1667933240070-8ac0757bdc8f',
    imageAlt: 'Elegant lemon tart with golden meringue peaks on a white ceramic plate',
    tags: ['vegetarian'],
    featured: false,
  },
];

const tagConfig: Record<string, { label: string; className: string }> = {
  vegan: { label: 'Vegan', className: 'dietary-vegan' },
  vegetarian: { label: 'Veg', className: 'dietary-vegan' },
  gf: { label: 'GF', className: 'dietary-gf' },
  spicy: { label: 'Spicy', className: 'dietary-spicy' },
  'dairy-free': { label: 'Dairy-Free', className: 'dietary-dairy-free' },
};

export default function FeaturedMenuSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label mb-2">Our Menu</p>
          <h2 className="text-display font-700 text-foreground">Crafted with Care</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            A sample menu of café favourites, with example prices in Nepali rupees.
          </p>
        </div>
        <Link
          href="/menu"
          className="hidden sm:flex items-center gap-2 text-primary font-600 text-sm hover:gap-3 transition-all duration-150"
        >
          Full Menu
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredItems.map((item) => (
          <article
            key={item.id}
            className="bg-card rounded-2xl border border-border overflow-hidden card-hover group"
          >
            <div className="relative h-48 overflow-hidden">
              <AppImage
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {item.featured && <div className="menu-card-ribbon">Featured</div>}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-xs text-muted-foreground font-500">{item.category}</span>
                  <h3 className="text-base font-700 text-foreground leading-tight">{item.name}</h3>
                </div>
                <span className="price-tag text-primary text-base flex-shrink-0">
                  Rs. {item.price.toLocaleString('en-NP')}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap">
                {item.tags.map((tag) => (
                  <span
                    key={`${item.id}-tag-${tag}`}
                    className={`text-xs font-600 px-2 py-0.5 rounded-full ${tagConfig[tag]?.className ?? ''}`}
                  >
                    {tagConfig[tag]?.label ?? tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-600 px-7 py-3 rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150"
        >
          Explore Full Menu
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
