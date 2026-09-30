import React from 'react';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const hours = [
  { id: 'hours-mon-fri', day: 'Monday – Friday', open: '7:00 AM', close: '9:00 PM', isToday: true },
  { id: 'hours-sat', day: 'Saturday', open: '8:00 AM', close: '10:00 PM', isToday: false },
  { id: 'hours-sun', day: 'Sunday', open: '9:00 AM', close: '7:00 PM', isToday: false },
];

export default function HoursLocationSection() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="text-center mb-12">
        <p className="section-label mb-2">Visit Us</p>
        <h2 className="text-display font-700 text-foreground">Find Luna Brew</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map placeholder */}
        <div className="relative rounded-2xl overflow-hidden bg-secondary border border-border h-80 lg:h-full min-h-[320px]">
          {/* Backend integration point: replace with Google Maps embed */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin size={24} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="font-700 text-foreground">142 Maple Street</p>
              <p className="text-muted-foreground text-sm">Brooklyn, NY 11201</p>
            </div>
            <a
              href="https://maps.google.com/?q=142+Maple+Street+Brooklyn+NY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-600 underline underline-offset-2"
            >
              Open in Google Maps
            </a>
          </div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 40px),
                repeating-linear-gradient(90deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 40px)
              `,
            }}
          />
        </div>

        {/* Info panel */}
        <div className="space-y-6">
          {/* Hours */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-primary" />
              <h3 className="font-700 text-foreground">Opening Hours</h3>
            </div>
            <ul className="space-y-3">
              {hours?.map((h) => (
                <li
                  key={h?.id}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${
                    h?.isToday ? 'bg-primary/8 border border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-500 text-foreground">{h?.day}</span>
                    {h?.isToday && (
                      <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-600">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="font-mono-data text-sm text-foreground font-600">
                    {h?.open} – {h?.close}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 bg-success-bg text-success rounded-xl px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              <span className="text-xs font-600">Open now · Closes at 9:00 PM</span>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-700 text-foreground mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              {[
                { Icon: MapPin, text: '142 Maple Street, Brooklyn, NY 11201', href: '#' },
                { Icon: Phone, text: '+1 (718) 555-0194', href: 'tel:+17185550194' },
                { Icon: Mail, text: 'hello@lunabrewcafe.com', href: 'mailto:hello@lunabrewcafe.com' },
              ]?.map(({ Icon, text, href }) => (
                <li key={`contact-${text}`}>
                  <a
                    href={href}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                      <Icon size={14} className="text-primary" />
                    </div>
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}