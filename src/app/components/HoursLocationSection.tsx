import React from 'react';
import { Clock, MapPin, Mail } from 'lucide-react';

const mapEmbedUrl =
  process.env.NEXT_PUBLIC_MAP_EMBED_URL ??
  'https://www.openstreetmap.org/export/embed.html?bbox=83.96%2C28.19%2C84.01%2C28.23&layer=mapnik&marker=28.2096%2C83.9856';

const hours = [
  { id: 'hours-mon-fri', day: 'Monday – Friday', open: '7:30 AM', close: '8:00 PM' },
  { id: 'hours-sat', day: 'Saturday', open: '8:00 AM', close: '9:00 PM' },
  { id: 'hours-sun', day: 'Sunday', open: '8:00 AM', close: '7:00 PM' },
];

export default function HoursLocationSection() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="text-center mb-12">
        <p className="section-label mb-2">Visit Us</p>
        <h2 className="text-display font-700 text-foreground">Find Luna Brew</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative rounded-2xl overflow-hidden bg-secondary border border-border h-80 lg:h-full min-h-[320px]">
          <iframe
            title="Map of the Lakeside area in Pokhara"
            src={mapEmbedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <p className="absolute bottom-3 left-3 rounded-lg bg-card/95 px-3 py-2 text-xs text-foreground shadow-card">
            Approximate Lakeside demo area — not a business address.
          </p>
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
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-500 text-foreground">{h?.day}</span>
                  </div>
                  <span className="font-mono-data text-sm text-foreground font-600">
                    {h?.open} – {h?.close}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
              Example hours for this fictional café concept.
            </p>
          </div>

          {/* Contact info */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-700 text-foreground mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              {[
                {
                  Icon: MapPin,
                  text: 'Lakeside, Pokhara, Nepal (approximate demo area)',
                  href: 'https://www.openstreetmap.org/search?query=Lakeside%2C%20Pokhara%2C%20Nepal',
                },
                {
                  Icon: Mail,
                  text: 'hello@lunabrew.example',
                  href: 'mailto:hello@lunabrew.example',
                },
              ]?.map(({ Icon, text, href }) => (
                <li key={`contact-${text}`}>
                  <a
                    href={href}
                    target={href.startsWith('https:') ? '_blank' : undefined}
                    rel={href.startsWith('https:') ? 'noreferrer' : undefined}
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
