import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { Coffee, Heart, Leaf } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const values = [
{
  id: 'val-craft',
  Icon: Coffee,
  title: 'Craft First',
  desc: 'Every espresso pull, every latte art pour — precision and passion in every cup.'
},
{
  id: 'val-community',
  Icon: Heart,
  title: 'Community',
  desc: 'Luna Brew was born from the neighborhood. We give back through local sourcing and partnerships.'
},
{
  id: 'val-sustainable',
  Icon: Leaf,
  title: 'Sustainable',
  desc: 'Compostable packaging, direct-trade beans, and zero food-waste initiatives every week.'
}];


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
                    sizes="(max-width: 1024px) 50vw, 25vw" />
                  
                </div>
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <AppImage
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_11873f7cc-1767510886204.png"
                    alt="Cozy cafe corner with wooden chairs, small table, and warm pendant lighting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw" />
                  
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <AppImage
                    src="https://images.unsplash.com/photo-1593301496848-b16bbe89dba0"
                    alt="Close-up of specialty coffee beans being poured into a grinder"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw" />
                  
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <AppImage
                    src="https://images.unsplash.com/photo-1617006898158-450d77727ed9"
                    alt="Fresh pastries and baked goods displayed on a wooden counter in a warm cafe"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw" />
                  
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-4 -right-4 bg-card rounded-2xl border border-border p-4 shadow-card max-w-[180px]">
              <p className="text-3xl font-800 text-primary font-mono-data">2019</p>
              <p className="text-xs text-muted-foreground font-500 mt-0.5">Est. in Brooklyn, NY</p>
              <p className="text-xs text-muted-foreground mt-1">Started with one espresso machine and a dream.</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="section-label mb-3">Our Story</p>
            <h2 className="text-display font-700 text-foreground mb-5">
              Born from a love of coffee and community
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Luna Brew Café opened its doors in 2019 with a simple mission: to create a space where
              quality coffee meets genuine hospitality. Founded by Maya Chen, a former barista
              champion and food scientist, every menu item reflects years of craft and care.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We source our beans directly from farms in Ethiopia, Colombia, and Guatemala —
              building relationships that ensure fair pay for farmers and exceptional flavor in
              every cup. Our kitchen team creates everything from scratch, daily.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values?.map(({ id, Icon, title, desc }) =>
              <div key={id} className="bg-card rounded-xl border border-border p-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <h4 className="font-700 text-sm text-foreground mb-1">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}