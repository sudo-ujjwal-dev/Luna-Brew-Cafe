'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { ArrowRight } from 'lucide-react';
import type { MenuItem } from '@/lib/menu-types';

export default function FeaturedMenuSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/menu?featured=true', { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as { items?: MenuItem[]; error?: string };
        if (!response.ok || !result.items) {
          throw new Error(result.error || 'Featured items are unavailable.');
        }
        setItems(result.items.slice(0, 3));
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Featured items are temporarily unavailable.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label mb-2">Our Menu</p>
          <h2 className="text-display font-700 text-foreground">Crafted with Care</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            A selection from the café menu, with prices in Nepali rupees.
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

      {loading ? (
        <div role="status" aria-label="Loading featured menu" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} aria-hidden="true" className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
              <div className="h-48 bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="py-14 text-center text-sm text-muted-foreground">
          {error}
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Featured menu items will appear here when the menu is set up.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
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
                {item.available && <div className="menu-card-ribbon">Featured</div>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="text-xs text-muted-foreground font-500">{item.category}</span>
                    <h3 className="text-base font-700 text-foreground leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <span className="price-tag text-primary text-base flex-shrink-0">
                    Rs. {item.price.toLocaleString('en-NP')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                {!item.available && (
                  <p className="mt-2 text-xs font-600 text-warning">Currently unavailable</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

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
