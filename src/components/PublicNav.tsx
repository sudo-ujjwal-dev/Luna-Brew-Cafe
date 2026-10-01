'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { cartItemCount, readCart, subscribeToCart } from '@/lib/cart';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/#about', label: 'About' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#contact', label: 'Contact' },
];

interface PublicNavProps {
  currentPath?: string;
}

export default function PublicNav({ currentPath = '/' }: PublicNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => setCartCount(cartItemCount(readCart()));
    updateCartCount();
    return subscribeToCart(updateCartCount);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-card/95 backdrop-blur-md shadow-nav border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <AppLogo size={36} />
              <div className="flex flex-col leading-tight">
                <span
                  className={`font-bold text-base tracking-tight transition-colors ${
                    scrolled ? 'text-foreground' : 'text-white'
                  }`}
                >
                  Luna Brew
                </span>
                <span
                  className={`text-xs font-medium transition-colors ${
                    scrolled ? 'text-muted-foreground' : 'text-white/70'
                  }`}
                >
                  Café
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={`nav-${link.href}`}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-500 rounded-lg transition-all duration-150 nav-link-underline ${
                    currentPath === link.href
                      ? scrolled
                        ? 'text-primary font-600'
                        : 'text-accent font-600'
                      : scrolled
                        ? 'text-foreground hover:text-primary hover:bg-secondary/60'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/cart"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-600 transition-colors ${
                  scrolled ? 'text-foreground hover:bg-secondary' : 'text-white hover:bg-white/10'
                }`}
              >
                <ShoppingBag size={16} />
                Cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
              <Link
                href="/#booking"
                className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-600 px-5 py-2.5 rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150"
              >
                Book a Table
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-foreground hover:bg-secondary' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } bg-card border-t border-border`}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={`mobile-nav-${link.href}`}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-500 transition-colors ${
                  currentPath === link.href
                    ? 'bg-secondary text-primary font-600'
                    : 'text-foreground hover:bg-secondary/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="mb-2 flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-600 text-foreground"
              >
                <ShoppingBag size={16} />
                Cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
              <Link
                href="/#booking"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-600 px-5 py-3 rounded-xl w-full hover:bg-primary/90 transition-all"
              >
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
