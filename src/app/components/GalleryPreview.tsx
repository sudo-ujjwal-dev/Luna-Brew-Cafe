'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const galleryImages = [
  {
    id: 'gal-001',
    src: 'https://images.unsplash.com/photo-1635076870262-9893a73ecb45',
    alt: 'Bright modern cafe interior with exposed brick walls, hanging plants, and white marble countertops',
    category: 'Interior',
    span: 'col-span-2 row-span-2',
  },
  {
    id: 'gal-002',
    src: 'https://images.unsplash.com/photo-1725394939762-59f74036a861',
    alt: 'Flat lay of coffee brewing equipment including chemex, grinder, and freshly roasted beans',
    category: 'Coffee',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'gal-003',
    src: 'https://images.unsplash.com/photo-1725394939762-59f74036a861',
    alt: 'Colorful brunch spread with eggs benedict, fresh fruit, and orange juice on a wooden table',
    category: 'Food',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'gal-004',
    src: 'https://images.unsplash.com/photo-1606168347215-38903eb09e0a',
    alt: 'Close up of barista hands holding a coffee cup with intricate latte art rosette',
    category: 'Coffee',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'gal-005',
    src: 'https://images.unsplash.com/photo-1607962323824-e97780d3b9b6',
    alt: 'Outdoor cafe terrace with string lights, potted plants, and customers enjoying evening coffee',
    category: 'Exterior',
    span: 'col-span-1 row-span-1',
  },
];

export default function GalleryPreview() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : 0));
  const next = () =>
    setLightboxIndex((i) => (i !== null ? Math.min(galleryImages.length - 1, i + 1) : 0));

  return (
    <>
      <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="text-center mb-10">
          <p className="section-label mb-2">Gallery</p>
          <h2 className="text-display font-700 text-foreground">A Glimpse Inside</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            From our cozy corners to the art of the pour — moments worth sharing.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-3 h-[480px] md:h-[520px]">
          {galleryImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${img.span}`}
              aria-label={`View gallery image: ${img.alt}`}
            >
              <AppImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <ZoomIn size={20} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-600 px-2.5 py-1 rounded-lg">
                  {img.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[60vh] md:h-[75vh]">
              <AppImage
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Controls */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={18} />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {lightboxIndex < galleryImages.length - 1 && (
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {galleryImages.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-150 ${
                    i === lightboxIndex ? 'bg-white w-5' : 'bg-white/40'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
