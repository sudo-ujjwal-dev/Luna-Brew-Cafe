import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { MapPin, Mail } from 'lucide-react';

const footerLinks = {
  explore: [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/#gallery', label: 'Gallery' },
    { href: '/#about', label: 'About Us' },
    { href: '/#contact', label: 'Contact' },
  ],
  hours: [
    { day: 'Monday – Friday', time: '7:30 AM – 8:00 PM' },
    { day: 'Saturday', time: '8:00 AM – 9:00 PM' },
    { day: 'Sunday', time: '8:00 AM – 7:00 PM' },
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
                <p className="text-white/50 text-xs">Fictional café concept</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              A fictional Lakeside, Pokhara café concept created as a portfolio project. Menu,
              hours, and contact details are illustrative.
            </p>
            <p className="text-xs text-white/50">
              No social profiles are configured for this demo.
            </p>
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
                <li
                  key={`footer-hours-${item?.day}`}
                  className="flex justify-between text-sm gap-4"
                >
                  <span className="text-white/60">{item?.day}</span>
                  <span className="text-white/90 font-mono-data text-xs whitespace-nowrap">
                    {item?.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-600 text-xs mb-4 tracking-wide uppercase">Find Us</h4>
            <ul className="space-y-3">
              {[
                { Icon: MapPin, text: 'Lakeside, Pokhara, Nepal · approximate demo area' },
                { Icon: Mail, text: 'hello@lunabrew.example' },
              ]?.map(({ Icon, text }) => (
                <li
                  key={`footer-contact-${text}`}
                  className="flex items-start gap-3 text-sm text-white/60"
                >
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
            <span>Demo content — not a real business listing.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
