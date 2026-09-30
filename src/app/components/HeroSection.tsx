import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { ArrowRight, Star, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_1be25ee1f-1772133378825.png"
          alt="Warm cafe interior with espresso machine, wooden tables, and soft morning light streaming through large windows"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw" />
        
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Floating badge */}
      <div className="absolute top-28 right-6 md:right-16 z-10 hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3">
        <div className="flex -space-x-1">
          {[1, 2, 3]?.map((i) =>
          <div key={`avatar-${i}`} className="w-7 h-7 rounded-full bg-accent/80 border-2 border-white/30 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{String.fromCharCode(65 + i)}</span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5]?.map((s) =>
            <Star key={`hero-star-${s}`} size={10} className="fill-accent text-accent" />
            )}
          </div>
          <p className="text-white/90 text-xs font-500">4.9 from 340+ reviews</p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <MapPin size={12} className="text-accent" />
          <span className="text-white/90 text-xs font-500">142 Maple Street, Brooklyn, NY</span>
        </div>

        <h1 className="text-hero font-800 text-white mb-4 text-balance">
          Good Coffee.{' '}
          <span className="text-accent">Good Food.</span>
          {' '}Good Moments.
        </h1>

        <p className="text-white/75 text-lg md:text-xl font-400 max-w-xl mx-auto mb-8 leading-relaxed">
          A neighborhood café where every cup tells a story. Specialty roasts, handcrafted meals,
          and a space that feels like home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/menu"
            className="flex items-center gap-2 bg-accent text-accent-foreground font-700 text-base px-7 py-3.5 rounded-2xl hover:bg-accent/90 active:scale-95 transition-all duration-150 shadow-lg">
            
            View Our Menu
            <ArrowRight size={18} />
          </Link>
          <Link
            href="#booking"
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-600 text-base px-7 py-3.5 rounded-2xl border border-white/25 hover:bg-white/25 active:scale-95 transition-all duration-150">
            
            Book a Table
          </Link>
        </div>

        {/* Quick stats */}
        <div className="flex items-center justify-center gap-8 mt-12">
          {[
          { value: '7+', label: 'Years Brewing' },
          { value: '40+', label: 'Menu Items' },
          { value: '340+', label: 'Happy Reviews' }]?.
          map(({ value, label }) =>
          <div key={`stat-${label}`} className="text-center">
              <p className="text-white font-800 text-2xl font-mono-data">{value}</p>
              <p className="text-white/60 text-xs font-500">{label}</p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-white/60 rounded-full" />
        </div>
        <span className="text-white/40 text-xs">Scroll</span>
      </div>
    </section>);

}