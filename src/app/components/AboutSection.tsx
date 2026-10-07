import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { Coffee, Heart, Leaf } from 'lucide-react';

const values = [
  {
    id: 'val-craft',
    Icon: Coffee,
    title: 'Craft First',
    desc: 'Coffee and café favourites for slow mornings and easy meetups.',
  },
  {
    id: 'val-community',
    Icon: Heart,
    title: 'Community',
    desc: 'A welcoming place to meet, take a break, and enjoy the Lakeside neighbourhood.',
  },
  {
    id: 'val-sustainable',
    Icon: Leaf,
    title: 'Sustainable',
    desc: 'A thoughtful approach to ingredients and everyday café hospitality.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-secondary/40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <AppImage
                    src="https://images.unsplash.com/photo-1576881695660-f5fb8e04b7c0"
                    alt="Barista carefully pouring steamed milk into espresso creating latte art in a ceramic cup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <AppImage
                    src="https://images.unsplash.com/photo-1593301496848-b16bbe89dba0"
                    alt="Cozy cafe corner with wooden chairs, small table, and warm pendant lighting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <AppImage
                    src="https://images.unsplash.com/photo-1593301496848-b16bbe89dba0"
                    alt="Close-up of specialty coffee beans being poured into a grinder"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <AppImage
                    src="https://images.unsplash.com/photo-1617006898158-450d77727ed9"
                    alt="Fresh pastries and baked goods displayed on a wooden counter in a warm cafe"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="section-label mb-3">Our Story</p>
            <h2 className="text-display font-700 text-foreground mb-5">
              A little pause in Lakeside
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Luna Brew Café brings together carefully prepared coffee and comforting café food in
              Lakeside, Pokhara. Settle in to meet, take a break, or ease into the day.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              From familiar café favourites to flavours inspired by Nepal, there is something to
              enjoy throughout the day.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values?.map(({ id, Icon, title, desc }) => (
                <div key={id} className="bg-card rounded-xl border border-border p-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <h4 className="font-700 text-sm text-foreground mb-1">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
