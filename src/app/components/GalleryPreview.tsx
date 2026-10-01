'use client';

import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  src: string;
  alt: string;
  category: string;
}

export default function GalleryPreview() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/gallery', { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as { images?: GalleryImage[]; error?: string };
        if (!response.ok || !result.images) {
          throw new Error(result.error || 'Gallery images are unavailable.');
        }
        setGalleryImages(result.images);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error ? requestError.message : 'Gallery is unavailable.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

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

        <div className="grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-3">
          {galleryImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              aria-label={`View gallery image: ${img.title}`}
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
        {loading && (
          <p role="status" className="py-8 text-center text-sm text-muted-foreground">
            Loading gallery…
          </p>
        )}
        {error && (
          <p role="alert" className="py-8 text-center text-sm text-danger">
            {error}
          </p>
        )}
        {!loading && !error && galleryImages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Gallery images will appear here when they have been added.
          </p>
        )}
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
