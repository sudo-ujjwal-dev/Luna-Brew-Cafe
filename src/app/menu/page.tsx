import React from 'react';
import type { Metadata } from 'next';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import MenuClient from './components/MenuClient';

export const metadata: Metadata = {
  title: 'Sample Menu — Luna Brew Café, Pokhara',
  description:
    'Browse sample coffee, tea, breakfast, café meals, and dessert items with example prices in Nepali rupees.',
};

export default function MenuPage() {
  return (
    <>
      <PublicNav currentPath="/menu" />
      <main className="min-h-screen">
        {/* Hero */}
        <div className="relative bg-foreground pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 50%, var(--accent) 0%, transparent 50%),
                                  radial-gradient(circle at 70% 50%, var(--primary) 0%, transparent 50%)`,
              }}
            />
          </div>
          <div className="max-w-screen-xl mx-auto relative z-10 text-center">
            <p className="text-accent text-xs font-600 uppercase tracking-widest mb-3">
              Sample menu · prices in NPR
            </p>
            <h1 className="text-display font-800 text-white mb-3">Our Menu</h1>
            <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
              Example coffee, tea, breakfast, café meals, and desserts for this fictional Pokhara
              café.
            </p>
          </div>
        </div>

        <MenuClient />
      </main>
      <PublicFooter />
    </>
  );
}
