import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { ArrowRight, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://images.unsplash.com/photo-1635076870262-9893a73ecb45"
          alt="Warm cafe interior with espresso machine, wooden tables, and soft morning light streaming through large windows"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <MapPin size={12} className="text-accent" />
          <span className="text-white/90 text-xs font-500">
            Lakeside, Pokhara, Nepal
          </span>
        </div>

        <h1 className="text-hero font-800 text-white mb-4 text-balance">
          Good Coffee. <span className="text-accent">Good Food.</span> Good Moments.
        </h1>

        <p className="text-white/75 text-lg md:text-xl font-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Coffee, comforting café favourites, and a relaxed place to pause by the lakeside.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/menu"
            className="flex items-center gap-2 bg-accent text-accent-foreground font-700 text-base px-7 py-3.5 rounded-2xl hover:bg-accent/90 active:scale-95 transition-all duration-150 shadow-lg"
          >
            View Our Menu
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/#booking"
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-600 text-base px-7 py-3.5 rounded-2xl border border-white/25 hover:bg-white/25 active:scale-95 transition-all duration-150"
          >
            Reserve a Table
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-white/60 rounded-full" />
        </div>
        <span className="text-white/40 text-xs">Scroll</span>
      </div>
    </section>
  );
}
