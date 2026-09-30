import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { MapPin, Phone, Mail } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';



const footerLinks = {
  explore: [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#about', label: 'About Us' },
    { href: '#contact', label: 'Contact' },
  ],
  hours: [
    { day: 'Monday – Friday', time: '7:00 AM – 9:00 PM' },
    { day: 'Saturday', time: '8:00 AM – 10:00 PM' },
    { day: 'Sunday', time: '9:00 AM – 7:00 PM' },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="bg-foreground text-white/80">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={36} />
              <div>
                <p className="font-bold text-white text-base">Luna Brew Café</p>
                <p className="text-white/50 text-xs">Est. 2019</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Good coffee. Good food. Good moments. A neighborhood café crafted for those who
              appreciate the art of a perfectly brewed cup.
            </p>
            <div className="flex items-center gap-3">
              {[
                {
                  label: 'Instagram',
                  href: '#',
                  svg: (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  label: 'Facebook',
                  href: '#',
                  svg: (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  label: 'Twitter',
                  href: '#',
                  svg: (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
              ]?.map(({ label, href, svg }) => (
                <a
                  key={`footer-social-${label}`}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent/30 hover:text-accent transition-all duration-150"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-600 text-sm mb-4 tracking-wide uppercase text-xs letter-spacing-wide">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {footerLinks?.explore?.map((link) => (
                <li key={`footer-link-${link?.href}`}>
                  <Link
                    href={link?.href}
                    className="text-sm text-white/60 hover:text-accent transition-colors duration-150"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-600 text-xs mb-4 tracking-wide uppercase">
              Opening Hours
            </h4>
            <ul className="space-y-3">
              {footerLinks?.hours?.map((item) => (
                <li key={`footer-hours-${item?.day}`} className="flex justify-between text-sm gap-4">
                  <span className="text-white/60">{item?.day}</span>
                  <span className="text-white/90 font-mono-data text-xs whitespace-nowrap">{item?.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-600 text-xs mb-4 tracking-wide uppercase">
              Find Us
            </h4>
            <ul className="space-y-3">
              {[
                { Icon: MapPin, text: '142 Maple Street, Brooklyn, NY 11201' },
                { Icon: Phone, text: '+1 (718) 555-0194' },
                { Icon: Mail, text: 'hello@lunabrewcafe.com' },
              ]?.map(({ Icon, text }) => (
                <li key={`footer-contact-${text}`} className="flex items-start gap-3 text-sm text-white/60">
                  <Icon size={14} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Luna Brew Café. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}