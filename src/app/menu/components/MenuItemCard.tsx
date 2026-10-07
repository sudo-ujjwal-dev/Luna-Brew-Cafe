'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { ShoppingCart } from 'lucide-react';
import type { MenuItem } from '@/lib/menu-types';
import { addItemToCart } from '@/lib/cart';

const tagConfig: Record<string, { label: string; className: string }> = {
  vegan: { label: 'Vegan', className: 'dietary-vegan' },
  vegetarian: { label: 'Veg', className: 'dietary-vegan' },
  gf: { label: 'GF', className: 'dietary-gf' },
  spicy: { label: 'Spicy', className: 'dietary-spicy' },
  'dairy-free': { label: 'Dairy-Free', className: 'dietary-dairy-free' },
};

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItemToCart(item.id);
    setAdded(true);
  };

  return (
    <article
      className={`bg-card rounded-2xl border border-border overflow-hidden card-hover group relative ${
        !item.available ? 'opacity-70' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <AppImage
          src={item.image}
          alt={item.imageAlt}
          fill
          className={`object-cover transition-transform duration-500 ${
            item.available ? 'group-hover:scale-105' : ''
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Unavailable overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-danger text-white text-xs font-700 px-3 py-1 rounded-full">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Featured ribbon */}
        {item.featured && item.available && <div className="menu-card-ribbon">Featured</div>}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs text-muted-foreground font-500">{item.category}</span>
        </div>

        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-700 text-foreground leading-tight">{item.name}</h3>
          <span className="price-tag text-primary text-base flex-shrink-0">
            Rs. {item.price.toLocaleString('en-NP')}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mb-3">
            {item.tags.map((tag) => (
              <span
                key={`${item.id}-tag-${tag}`}
                className={`text-xs font-600 px-1.5 py-0.5 rounded-full ${tagConfig[tag]?.className ?? ''}`}
              >
                {tagConfig[tag]?.label ?? tag}
              </span>
            ))}
          </div>
        )}

        {/* Action */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!item.available}
          aria-live="polite"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98] transition-all duration-150 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          <ShoppingCart size={14} />
          {added ? 'Added to cart' : item.available ? 'Add to order' : 'Unavailable'}
        </button>
      </div>
    </article>
  );
}
